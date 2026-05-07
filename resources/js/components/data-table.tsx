// components/data-table.tsx
import { router } from '@inertiajs/react';
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { PaginationLinks, PaginationMeta } from '@/types/pagination';

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    meta?: PaginationMeta;
    links?: PaginationLinks;
    onPageChange?: (page: number, pageSize: number) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    meta,
    links,
    onPageChange,
}: DataTableProps<TData, TValue>) {
    // Read sorting from URL
    const getSortingFromURL = (): SortingState => {
        const params = new URLSearchParams(window.location.search);
        const sortParam = params.get('sort');

        if (sortParam) {
            const isDesc = sortParam.startsWith('-');
            const field = isDesc ? sortParam.substring(1) : sortParam;

            return [{ id: field, desc: isDesc }];
        }

        return [];
    };

    const [sorting, setSorting] = useState<SortingState>(getSortingFromURL());

    // Handle sort changes - Fixed typing
    const handleSortingChange = (
        updaterOrValue: SortingState | ((old: SortingState) => SortingState),
    ) => {
        // Calculate the new sorting state
        const newSorting =
            typeof updaterOrValue === 'function'
                ? updaterOrValue(sorting)
                : updaterOrValue;

        setSorting(newSorting);

        const url = new URL(window.location.href);

        if (newSorting.length > 0) {
            const sort = newSorting[0];
            const sortValue = sort.desc ? `-${sort.id}` : sort.id;
            url.searchParams.set('sort', sortValue);
        } else {
            url.searchParams.delete('sort');
        }

        // Reset to page 1 when sorting changes
        url.searchParams.set('page', '1');

        router.get(
            url.pathname + url.search,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
        },
        onSortingChange: handleSortingChange,
        manualSorting: true,
    });

    // Calculate derived values
    const currentPage = meta?.current_page ?? 1;
    const pageSize = meta?.per_page ?? 10;
    const totalCount = meta?.total ?? data.length;
    const pageCount = meta?.last_page ?? Math.ceil(totalCount / pageSize);
    const from = meta?.from ?? (currentPage - 1) * pageSize + 1;
    const to = meta?.to ?? Math.min(currentPage * pageSize, totalCount);

    const handlePageNavigation = (url: string | null) => {
        if (!url) {
            return;
        }

        if (onPageChange) {
            // Client-side: extract page number and call callback
            const page = new URL(url).searchParams.get('page');

            if (page) {
                onPageChange(parseInt(page), pageSize);
            }

            return;
        }

        router.visit(url);
    };

    const handlePageSizeChange = (newPageSize: number) => {
        if (onPageChange) {
            onPageChange(1, newPageSize); // Reset to page 1

            return;
        }

        // Server-side: rebuild URL with new per_page
        const url = new URL(meta?.path ?? window.location.href);
        url.searchParams.set('page', '1');
        url.searchParams.set('per_page', newPageSize.toString());
        router.visit(url.toString());
    };

    return (
        <div className="space-y-4">
            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
                                                  header.getContext(),
                                              )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && 'selected'
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls — only render if meta/links provided */}
            {meta && links && (
                <div className="flex items-center justify-between px-2">
                    {/* Entry count info */}
                    <div className="flex-1 text-sm text-muted-foreground">
                        Showing {from} to {to} of {totalCount} entries
                    </div>

                    <div className="flex items-center space-x-6 lg:space-x-8">
                        {/* Rows per page selector */}
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={(value) =>
                                    handlePageSizeChange(Number(value))
                                }
                            >
                                <SelectTrigger className="h-8 w-17.5">
                                    <SelectValue placeholder={`${pageSize}`} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {[5, 10, 20, 30, 40, 50].map((size) => (
                                        <SelectItem
                                            key={size}
                                            value={`${size}`}
                                        >
                                            {size}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Page navigation buttons */}
                        <div className="flex items-center space-x-2">
                            {/* First page */}
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() =>
                                    handlePageNavigation(links.first)
                                }
                                disabled={!links.first || currentPage === 1}
                            >
                                <span className="sr-only">
                                    Go to first page
                                </span>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>

                            {/* Previous page */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePageNavigation(links.prev)}
                                disabled={!links.prev || currentPage === 1}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {/* Page indicator */}
                            <div className="flex w-25 items-center justify-center text-sm font-medium">
                                Page {currentPage} of {pageCount}
                            </div>

                            {/* Next page */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => handlePageNavigation(links.next)}
                                disabled={
                                    !links.next || currentPage >= pageCount
                                }
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            {/* Last page */}
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() => handlePageNavigation(links.last)}
                                disabled={
                                    !links.last || currentPage >= pageCount
                                }
                            >
                                <span className="sr-only">Go to last page</span>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

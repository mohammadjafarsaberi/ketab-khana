// components/client-data-table.tsx
import type { ColumnDef, SortingState } from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    Search,
    X,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

interface ClientDataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchPlaceholder?: string;
    searchColumn?: string;
    showSearch?: boolean;
    showRowCount?: boolean;
    pageSizeOptions?: number[];
    defaultPageSize?: number;
}

export function ClientDataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = 'Search...',
    searchColumn,
    showSearch = true,
    showRowCount = true,
    pageSizeOptions = [5, 10, 20, 30, 40, 50],
    defaultPageSize = 10,
}: ClientDataTableProps<TData, TValue>) {
    // Client-side state
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: defaultPageSize,
    });

    // Custom search across all columns or specific column
    const globalFilterFn = (
        row: any,
        columnId: string,
        filterValue: string,
    ) => {
        if (!filterValue) {
            return true;
        }

        if (searchColumn) {
            // Search only specific column
            const value = row.getValue(searchColumn);

            return value
                ?.toString()
                .toLowerCase()
                .includes(filterValue.toLowerCase());
        } else {
            // Search all columns
            return Object.values(row.original).some((value) =>
                value
                    ?.toString()
                    .toLowerCase()
                    .includes(filterValue.toLowerCase()),
            );
        }
    };

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        globalFilterFn: globalFilterFn,
    });

    // Calculate display values
    const currentPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();
    const totalCount = data.length;
    const filteredCount = table.getFilteredRowModel().rows.length;
    const pageSize = table.getState().pagination.pageSize;
    const from = table.getState().pagination.pageIndex * pageSize + 1;
    const to = Math.min(
        (table.getState().pagination.pageIndex + 1) * pageSize,
        filteredCount,
    );

    // Clear search
    const clearSearch = () => {
        setGlobalFilter('');
    };

    return (
        <div className="space-y-4">
            {/* Search and Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                {showSearch && (
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute top-2.5 left-2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={searchPlaceholder}
                            value={globalFilter ?? ''}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="pr-8 pl-8"
                        />
                        {globalFilter && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-0 right-0 h-9 w-9 p-0"
                                onClick={clearSearch}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                )}

                {showRowCount && (
                    <div className="text-sm text-muted-foreground">
                        {globalFilter ? (
                            <>
                                Showing {filteredCount} of {totalCount} entries
                            </>
                        ) : (
                            <>Total: {totalCount} entries</>
                        )}
                    </div>
                )}
            </div>

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
                                    className="transition-colors hover:bg-muted/50"
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
                                    className="h-48 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <Search className="h-8 w-8 text-muted-foreground" />
                                        <p className="text-muted-foreground">
                                            {globalFilter
                                                ? 'No results found.'
                                                : 'No data available.'}
                                        </p>
                                        {globalFilter && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={clearSearch}
                                            >
                                                Clear search
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {filteredCount > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-4 px-2">
                    {/* Entry count info */}
                    <div className="text-sm text-muted-foreground">
                        Showing {from} to {to} of {filteredCount} entries
                    </div>

                    <div className="flex items-center space-x-6 lg:space-x-8">
                        {/* Rows per page selector */}
                        <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium">Rows per page</p>
                            <Select
                                value={`${pageSize}`}
                                onValueChange={(value) => {
                                    table.setPageSize(Number(value));
                                    table.setPageIndex(0);
                                }}
                            >
                                <SelectTrigger className="h-8 w-17.5">
                                    <SelectValue placeholder={`${pageSize}`} />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {pageSizeOptions.map((size) => (
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
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
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
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                <span className="sr-only">
                                    Go to previous page
                                </span>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>

                            {/* Page indicator */}
                            <div className="flex min-w-25 items-center justify-center text-sm font-medium">
                                Page {currentPage} of {pageCount}
                            </div>

                            {/* Next page */}
                            <Button
                                variant="outline"
                                className="h-8 w-8 p-0"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                <span className="sr-only">Go to next page</span>
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            {/* Last page */}
                            <Button
                                variant="outline"
                                className="hidden h-8 w-8 p-0 lg:flex"
                                onClick={() =>
                                    table.setPageIndex(pageCount - 1)
                                }
                                disabled={!table.getCanNextPage()}
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

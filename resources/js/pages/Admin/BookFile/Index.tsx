import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/BookFileController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Search from '@/components/Search';
import { Button } from '@/components/ui/button';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { bookFileColumns } from '@/pages/Admin/BookFile/Column';
import type { BookFile } from '@/pages/Admin/BookFile/Column';
import { create, edit, index, show } from '@/routes/admin/book-files';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
    filters,
}: {
    data: PaginatedResponse<BookFile>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const { columns, DeleteDialog } = useDataTableColumns(bookFileColumns, {
        onView: (bookFile) => router.visit(show(bookFile.id)),
        onEdit: (bookFile) => router.visit(edit(bookFile.id)),
        onDelete: (bookFile) => router.delete(destroy(bookFile.id)),
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Book Files" />
            <div className="flex justify-between">
                <Heading title="Book Files" />
                <Button>
                    <Link href={create()}>Add Book File</Link>
                </Button>
            </div>
            <DataTable
                data={data}
                columns={columns}
                meta={meta}
                links={links}
                toolbar={
                    <Search
                        url={index.url()}
                        searchTerm={search}
                        setSearchTerm={setSearch}
                        placeholder="Search book files..."
                        only={['data', 'filters']}
                    />
                }
            />
            <DeleteDialog />
        </div>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Book Files', href: index() }] };

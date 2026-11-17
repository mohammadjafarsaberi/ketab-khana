import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/BookController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Search from '@/components/Search';
import { Button } from '@/components/ui/button';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { bookColumns } from '@/pages/Admin/Book/Column';
import type { Book } from '@/pages/Admin/Book/Column';
import { create, edit, index, show } from '@/routes/admin/books';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
    filters,
}: {
    data: PaginatedResponse<Book>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const { columns, DeleteDialog } = useDataTableColumns(bookColumns, {
        onView: (book) => router.visit(show(book.id)),
        onEdit: (book) => router.visit(edit(book.id)),
        onDelete: (book) => router.delete(destroy(book.id)),
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Books" />
            <div className="flex justify-between">
                <Heading title="Books" />
                <Button>
                    <Link href={create()}>Add Book</Link>
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
                        placeholder="Search books..."
                        only={['data', 'filters']}
                    />
                }
            />
            <DeleteDialog />
        </div>
    );
}

Index.layout = {
    breadcrumbs: [{ title: 'Books', href: index() }],
};

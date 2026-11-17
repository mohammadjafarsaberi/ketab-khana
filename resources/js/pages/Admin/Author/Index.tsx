import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/AuthorController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Search from '@/components/Search';
import { Button } from '@/components/ui/button';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import type { Author } from '@/pages/Admin/Author/Column';
import { authorColumns } from '@/pages/Admin/Author/Column';
import { create, edit, index, show } from '@/routes/admin/authors';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
    filters,
}: {
    data: PaginatedResponse<Author>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const { columns, DeleteDialog } = useDataTableColumns(authorColumns, {
        onView: (author) => router.visit(show(author.id)),
        onEdit: (author) => router.visit(edit(author.id)),
        onDelete: (author) => {
            router.delete(destroy.url(author.id), {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['data'] }),
            });
        },
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Authors" />
            <div className="flex justify-between">
                <Heading title="Authors" />
                <Button>
                    <Link href={create()}>Add Author</Link>
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
                        placeholder="Search authors..."
                        only={['data', 'filters']}
                    />
                }
            />

            <DeleteDialog />
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Authors',
            href: index(),
        },
    ],
};

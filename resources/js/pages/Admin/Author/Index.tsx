import { Head, Link, router } from '@inertiajs/react';
import { destroy } from '@/actions/App/Http/Controllers/AuthorController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import type { Author } from '@/pages/Admin/Author/Column';
import { authorColumns } from '@/pages/Admin/Author/Column';
import { index, create, edit } from '@/routes/authors';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
}: {
    data: PaginatedResponse<Author>;
}) {


    const {columns, DeleteDialog} = useDataTableColumns(authorColumns, {
        onView: (author) => console.log(author),
        onEdit: (author) => router.visit(edit(author.id)),
        onDelete: (author) => {
                router.delete(destroy(author.id));
        },
        custom: [
            {
                label: 'View Books',
                icon: '📚',
                onClick: (item) => console.log(item),
            },
        ],
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
            />

            <DeleteDialog/>

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
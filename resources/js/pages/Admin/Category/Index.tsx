import { Head, Link, router } from '@inertiajs/react';
import { destroy } from '@/actions/App/Http/Controllers/CategoryController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import type { Category } from '@/pages/Admin/Category/Column';
import { categoryColumns } from '@/pages/Admin/Category/Column';
import { index, create, edit } from '@/routes/categories';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
}: {
    data: PaginatedResponse<Category>;
}) {


    const columns = useDataTableColumns(categoryColumns, {
        onView: (category) => console.log(category),
        onEdit: (category) => router.visit(edit(category.id)),
        onDelete: (category) => {
            if (confirm('Are you sure?')) {
                router.delete(destroy(category.id));
            }
        },
        custom: [
            {
                label: 'Preview',
                icon: '📖',
                onClick: (item) => console.log(item),
            },
            {
                label: 'Download All',
                icon: '⬇️',
                onClick: (item) => console.log(item),
            },
        ],
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Categories" />
            <div className="flex justify-between">
                <Heading title="Categories" />
                <Button>
                    <Link href={create()}>Add Category</Link>
                </Button>
            </div>

            <DataTable
                data={data}
                columns={columns}
                meta={meta}
                links={links}
            />
        </div>
    );
}

Index.layout = {
    breadcrumbs: [
        {
            title: 'Categories',
            href: index(),
        },
    ],
};

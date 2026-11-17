import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/CategoryController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Search from '@/components/Search';
import { Button } from '@/components/ui/button';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import type { Category } from '@/pages/Admin/Category/Column';
import { categoryColumns } from '@/pages/Admin/Category/Column';
import { create, edit, index, show } from '@/routes/admin/categories';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
    filters,
}: {
    data: PaginatedResponse<Category>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const { columns, DeleteDialog } = useDataTableColumns(categoryColumns, {
        onView: (category) => router.visit(show(category.id)),
        onEdit: (category) => router.visit(edit(category.id)),
        onDelete: (category) => {
            router.delete(destroy.url(category.id), {
                preserveScroll: true,
                onSuccess: () => router.reload({ only: ['data'] }),
            });
        },
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Categories" />
            <div className="flex items-center justify-between gap-4">
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
                toolbar={
                    <Search
                        url={index.url()}
                        searchTerm={search}
                        setSearchTerm={setSearch}
                        placeholder="Search categories..."
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
            title: 'Categories',
            href: index(),
        },
    ],
};

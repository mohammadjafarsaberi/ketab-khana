import { Head, router } from '@inertiajs/react';
import { destroy } from '@/actions/App/Http/Controllers/UserController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { userColumns } from '@/pages/Admin/User/Column';
import type { AdminUser } from '@/pages/Admin/User/Column';
import { edit, index, show } from '@/routes/admin/users';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
}: {
    data: PaginatedResponse<AdminUser>;
}) {
    const { columns, DeleteDialog } = useDataTableColumns(userColumns, {
        onView: (user) => router.visit(show(user.id)),
        onEdit: (user) => router.visit(edit(user.id)),
        onDelete: (user) => router.delete(destroy(user.id)),
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Users" />
            <Heading title="Users" />
            <DataTable
                data={data}
                columns={columns}
                meta={meta}
                links={links}
            />
            <DeleteDialog />
        </div>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Users', href: index() }] };

import { Head, router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { favoriteColumns } from '@/pages/Admin/Favorite/Column';
import type { Favorite } from '@/pages/Admin/Favorite/Column';
import { index, show } from '@/routes/admin/favorites';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
}: {
    data: PaginatedResponse<Favorite>;
}) {
    const { columns } = useDataTableColumns(favoriteColumns, {
        onView: (favorite) => router.visit(show(favorite.id)),
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Favorites" />
            <Heading title="Favorites" />
            <DataTable
                data={data}
                columns={columns}
                meta={meta}
                links={links}
            />
        </div>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Favorites', href: index() }] };

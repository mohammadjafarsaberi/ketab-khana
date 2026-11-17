import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Search from '@/components/Search';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { favoriteColumns } from '@/pages/Admin/Favorite/Column';
import type { Favorite } from '@/pages/Admin/Favorite/Column';
import { index, show } from '@/routes/admin/favorites';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
    filters,
}: {
    data: PaginatedResponse<Favorite>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
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
                toolbar={
                    <Search
                        url={index.url()}
                        searchTerm={search}
                        setSearchTerm={setSearch}
                        placeholder="Search favorites..."
                        only={['data', 'filters']}
                    />
                }
            />
        </div>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Favorites', href: index() }] };

import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import Search from '@/components/Search';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { bookDownloadColumns } from '@/pages/Admin/BookDownload/Column';
import type { BookDownload } from '@/pages/Admin/BookDownload/Column';
import { index, show } from '@/routes/admin/downloads';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
    filters,
}: {
    data: PaginatedResponse<BookDownload>;
    filters: { search: string };
}) {
    const [search, setSearch] = useState(filters.search);
    const { columns } = useDataTableColumns(bookDownloadColumns, {
        onView: (download) => router.visit(show(download.id)),
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Downloads" />
            <Heading title="Downloads" />
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
                        placeholder="Search downloads..."
                        only={['data', 'filters']}
                    />
                }
            />
        </div>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Downloads', href: index() }] };

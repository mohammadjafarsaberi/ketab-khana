import { Head, router } from '@inertiajs/react';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { bookDownloadColumns } from '@/pages/Admin/BookDownload/Column';
import type { BookDownload } from '@/pages/Admin/BookDownload/Column';
import { index, show } from '@/routes/admin/downloads';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
}: {
    data: PaginatedResponse<BookDownload>;
}) {
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
            />
        </div>
    );
}

Index.layout = { breadcrumbs: [{ title: 'Downloads', href: index() }] };

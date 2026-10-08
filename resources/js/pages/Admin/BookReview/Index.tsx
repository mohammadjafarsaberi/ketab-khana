import { Head, router } from '@inertiajs/react';
import {
    destroy,
    update,
} from '@/actions/App/Http/Controllers/BookReviewController';
import { DataTable } from '@/components/data-table';
import Heading from '@/components/heading';
import { useDataTableColumns } from '@/hooks/use-data-table-columns';
import { bookReviewColumns } from '@/pages/Admin/BookReview/Column';
import type { BookReview } from '@/pages/Admin/BookReview/Column';
import { index, show } from '@/routes/admin/reviews';
import type { PaginatedResponse } from '@/types/pagination';

export default function Index({
    data: { data, meta, links },
}: {
    data: PaginatedResponse<BookReview>;
}) {
    const { columns, DeleteDialog } = useDataTableColumns(bookReviewColumns, {
        onView: (review) => router.visit(show(review.id)),
        onDelete: (review) => router.delete(destroy(review.id)),
        custom: [
            {
                label: 'Approve',
                onClick: (review) =>
                    router.put(update(review.id), { status: 'approved' }),
            },
            {
                label: 'Reject',
                onClick: (review) =>
                    router.put(update(review.id), { status: 'rejected' }),
            },
        ],
    });

    return (
        <div className="container mx-auto p-8">
            <Head title="Reviews" />
            <Heading title="Reviews" />
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

Index.layout = { breadcrumbs: [{ title: 'Reviews', href: index() }] };

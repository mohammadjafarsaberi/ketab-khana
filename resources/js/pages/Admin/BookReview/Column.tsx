import type { ColumnDef } from '@tanstack/react-table';
import { SortButton } from '@/components/SortButton';
import { Badge } from '@/components/ui/badge';
import type { Book, Option } from '@/pages/Admin/Book/Column';

export type BookReview = {
    id: number;
    user_id: number;
    book_id: number;
    rating: number;
    review_text: string;
    is_approved: boolean;
    moderation_status: 'pending' | 'approved' | 'rejected';
    user?: Option;
    book?: Book;
};

export const bookReviewColumns: ColumnDef<BookReview>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortButton column={column} label="ID" />,
    },
    {
        accessorKey: 'book.title',
        header: 'Book',
        cell: ({ row }) => row.original.book?.title ?? '-',
    },
    {
        accessorKey: 'user.name',
        header: 'User',
        cell: ({ row }) =>
            row.original.user?.name ?? row.original.user?.email ?? '-',
    },
    {
        accessorKey: 'rating',
        header: ({ column }) => <SortButton column={column} label="Rating" />,
        cell: ({ row }) => `${row.original.rating}/5`,
    },
    {
        accessorKey: 'review_text',
        header: 'Review',
        cell: ({ row }) => (
            <div className="max-w-xs truncate">{row.original.review_text}</div>
        ),
    },
    {
        accessorKey: 'is_approved',
        header: 'Status',
        cell: ({ row }) => (
            <Badge
                variant={
                    row.original.moderation_status === 'approved'
                        ? 'default'
                        : 'secondary'
                }
            >
                {row.original.moderation_status.charAt(0).toUpperCase() +
                    row.original.moderation_status.slice(1)}
            </Badge>
        ),
    },
];

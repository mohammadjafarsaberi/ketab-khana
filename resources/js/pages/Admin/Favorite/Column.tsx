import type { ColumnDef } from '@tanstack/react-table';
import { SortButton } from '@/components/SortButton';
import type { Book, Option } from '@/pages/Admin/Book/Column';

export type Favorite = {
    id: number;
    user_id: number;
    book_id: number;
    user?: Option;
    book?: Book;
};

export const favoriteColumns: ColumnDef<Favorite>[] = [
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
];

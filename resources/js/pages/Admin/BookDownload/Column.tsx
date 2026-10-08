import type { ColumnDef } from '@tanstack/react-table';
import { SortButton } from '@/components/SortButton';
import type { Book, Option } from '@/pages/Admin/Book/Column';
import type { BookFile } from '@/pages/Admin/BookFile/Column';

export type BookDownload = {
    id: number;
    user_id: number;
    book_id: number;
    book_file_id: number | null;
    downloaded_at: string | null;
    downloaded_at_input: string | null;
    user?: Option;
    book?: Book;
    file?: BookFile;
};

export type BookFileOption = {
    id: number;
    book_id: number;
    format: string;
    file_name: string | null;
    book?: Pick<Book, 'id' | 'title'>;
};

export const bookDownloadColumns: ColumnDef<BookDownload>[] = [
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
        accessorKey: 'file.format',
        header: 'File',
        cell: ({ row }) => {
            const file = row.original.file;

            return file ? `${file.format.toUpperCase()} #${file.id}` : '-';
        },
    },
    {
        accessorKey: 'downloaded_at',
        header: ({ column }) => (
            <SortButton column={column} label="Downloaded At" />
        ),
        cell: ({ row }) => row.original.downloaded_at ?? '-',
    },
];

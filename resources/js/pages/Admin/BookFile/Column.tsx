import type { ColumnDef } from '@tanstack/react-table';
import { SortButton } from '@/components/SortButton';
import { Badge } from '@/components/ui/badge';
import type { Book } from '@/pages/Admin/Book/Column';

export type BookFile = {
    id: number;
    book_id: number;
    book?: Book;
    format: string;
    language: string | null;
    version: string | null;
    file_name: string | null;
    file_size: number | null;
};

export const bookFileColumns: ColumnDef<BookFile>[] = [
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
        accessorKey: 'format',
        header: ({ column }) => <SortButton column={column} label="Format" />,
        cell: ({ row }) => (
            <Badge variant="secondary">
                {row.original.format.toUpperCase()}
            </Badge>
        ),
    },
    {
        accessorKey: 'language',
        header: ({ column }) => <SortButton column={column} label="Language" />,
        cell: ({ row }) => row.original.language ?? '-',
    },
    {
        accessorKey: 'version',
        header: 'Version',
        cell: ({ row }) => row.original.version ?? '-',
    },
    {
        accessorKey: 'file_name',
        header: 'File',
        cell: ({ row }) => row.original.file_name ?? `File #${row.original.id}`,
    },
];

import type { ColumnDef } from "@tanstack/react-table"
import { SortButton } from '@/components/SortButton';


export type Author = {
    id: number
    name: string
    bio: string | null
    image: string | null
    books_count?: number
}

export const authorColumns: ColumnDef<Author>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortButton column={column} label={"ID"}/>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'bio',
        header: 'Bio',
        cell: ({ row }) => {
            const bio = row.getValue('bio') as string;
            return <div className="max-w-xs truncate">{bio || '-'}</div>;
        },
    },
    {
        accessorKey: 'books_count',
        header: 'Books Count',
        cell: ({ row }) => {
            const count = row.getValue('books_count') as number;
            return <div>{count || 0}</div>;
        },
    },
];
import type { ColumnDef } from '@tanstack/react-table';
import { AvatarWithFallback } from '@/components/AvatarWithFallback';
import { SortButton } from '@/components/SortButton';
import { Badge } from '@/components/ui/badge';

export type Option = {
    id: number;
    name?: string;
    title?: string;
    email?: string;
};

export type Book = {
    id: number;
    title: string;
    slug: string;
    author_id: number;
    category_id: number;
    isbn: string | null;
    description: string | null;
    cover_image: string | null;
    language: string;
    pages: number | null;
    published_year: number | null;
    tags: string[] | null;
    tags_text: string | null;
    downloads_count: number;
    is_active: boolean;
    author?: Option;
    category?: Option;
    files_count?: number;
    reviews_count?: number;
    favorites_count?: number;
};

export const bookColumns: ColumnDef<Book>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortButton column={column} label="ID" />,
    },
    {
        accessorKey: 'cover_image',
        header: 'Cover',
        cell: ({ row }) => (
            <AvatarWithFallback
                image={row.original.cover_image}
                name={row.original.title}
                className="h-10 w-10 rounded-md"
            />
        ),
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <SortButton column={column} label="Title" />,
    },
    {
        accessorKey: 'author.name',
        header: 'Author',
        cell: ({ row }) => row.original.author?.name ?? '-',
    },
    {
        accessorKey: 'category.name',
        header: 'Category',
        cell: ({ row }) => row.original.category?.name ?? '-',
    },
    {
        accessorKey: 'language',
        header: ({ column }) => <SortButton column={column} label="Language" />,
    },
    {
        accessorKey: 'downloads_count',
        header: ({ column }) => (
            <SortButton column={column} label="Downloads" />
        ),
    },
    {
        accessorKey: 'is_active',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.is_active ? 'default' : 'secondary'}>
                {row.original.is_active ? 'Active' : 'Inactive'}
            </Badge>
        ),
    },
];

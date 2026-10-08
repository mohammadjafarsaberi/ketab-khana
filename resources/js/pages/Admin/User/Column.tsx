import type { ColumnDef } from '@tanstack/react-table';
import { AvatarWithFallback } from '@/components/AvatarWithFallback';
import { SortButton } from '@/components/SortButton';
import { Badge } from '@/components/ui/badge';

export type AdminUser = {
    id: number;
    name: string;
    email: string;
    provider: string | null;
    avatar: string | null;
    total_downloads: number;
    last_download_at: string | null;
    is_banned: boolean;
    role: 'admin' | 'user';
    downloads_count?: number;
    favorites_count?: number;
    reviews_count?: number;
};

export const userColumns: ColumnDef<AdminUser>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortButton column={column} label="ID" />,
    },
    {
        accessorKey: 'avatar',
        header: 'Avatar',
        cell: ({ row }) => (
            <AvatarWithFallback
                image={row.original.avatar}
                name={row.original.name}
                className="h-9 w-9"
            />
        ),
    },
    {
        accessorKey: 'name',
        header: ({ column }) => <SortButton column={column} label="Name" />,
    },
    {
        accessorKey: 'email',
        header: ({ column }) => <SortButton column={column} label="Email" />,
    },
    {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => row.original.provider ?? 'email',
    },
    {
        accessorKey: 'total_downloads',
        header: ({ column }) => (
            <SortButton column={column} label="Downloads" />
        ),
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <Badge variant="outline">{row.original.role}</Badge>,
    },
    {
        accessorKey: 'is_banned',
        header: 'Status',
        cell: ({ row }) => (
            <Badge variant={row.original.is_banned ? 'destructive' : 'default'}>
                {row.original.is_banned ? 'Banned' : 'Active'}
            </Badge>
        ),
    },
];

import type { ColumnDef } from "@tanstack/react-table"
import { SortButton } from '@/components/SortButton';


export type Category = {
    id: number
    name: string
    is_active: boolean
    description: string
}

export const categoryColumns: ColumnDef<Category>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => <SortButton column={column} label={"ID"}/>,
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'description',
        header: 'Description',
    },
    {
        accessorKey: 'is_active',
        header: ({ column }) => <SortButton column={column} label={"Active"}/>,
        cell: ({ row }) => {
            const isActive = row.getValue('is_active') == true ? 'Yes' : 'No';

            return <div>{isActive}</div>;
        },
    },
];

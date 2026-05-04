import type { ColumnDef } from "@tanstack/react-table"


export type Category = {
    id: number
    name: string
    isActive: boolean
    description: string
}

export const categoryColumns: ColumnDef<Category>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
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
        accessorKey: 'isActive',
        header: 'Active',
        cell: ({ row }) => {
            const isActive = row.getValue('isActive') == true ? 'Yes' : 'No';

            return <div>{isActive}</div>;
        },
    },
];

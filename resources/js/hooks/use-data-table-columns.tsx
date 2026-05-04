import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Action<T> = {
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
    variant?: "default" | "destructive";
};

type ActionHandlers<T> = {
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    custom?: Action<T>[];
};

export function useDataTableColumns<T>(
    baseColumns: ColumnDef<T>[],
    actions?: ActionHandlers<T>
): ColumnDef<T>[] {
    const actionColumn: ColumnDef<T> = {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const item = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">


                        {actions?.onView && (
                            <DropdownMenuItem
                                className={'cursor-pointer'}
                                onClick={() => actions.onView!(item)}
                            >
                                👁️ View
                            </DropdownMenuItem>
                        )}

                        {actions?.onEdit && (
                            <DropdownMenuItem
                                className={'cursor-pointer'}
                                onClick={() => actions.onEdit!(item)}
                            >
                                ✏️ Edit
                            </DropdownMenuItem>
                        )}

                        {actions?.custom?.map((action, index) => (
                            <DropdownMenuItem
                                key={index}
                                onClick={() => action.onClick(item)}
                                className={
                                    action.variant === 'destructive'
                                        ? 'cursor-pointer text-destructive'
                                        : 'cursor-pointer'
                                }
                            >
                                {action.icon} {action.label}
                            </DropdownMenuItem>
                        ))}

                        {actions?.onDelete && (
                            <DropdownMenuItem
                                onClick={() => actions.onDelete!(item)}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                🗑️ Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    };

    return [...baseColumns, actionColumn];
}

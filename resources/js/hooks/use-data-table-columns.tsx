import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

type ActionHandlers<T> = {
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  custom?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: (row: T) => void;
  }>;
};

export function useDataTableColumns<T>(baseColumns: ColumnDef<T>[], actions?: ActionHandlers<T>) {
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const columns: ColumnDef<T>[] = [
    ...baseColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {actions?.onView && (
                <DropdownMenuItem onClick={() => actions.onView!(item)}>
                  👁️ View
                </DropdownMenuItem>
              )}

              {actions?.onEdit && (
                <DropdownMenuItem onClick={() => actions.onEdit!(item)}>
                  ✏️ Edit
                </DropdownMenuItem>
              )}

              {actions?.custom?.map((action, index) => (
                <DropdownMenuItem key={index} onClick={() => action.onClick(item)}>
                  {action.icon} {action.label}
                </DropdownMenuItem>
              ))}

              {actions?.onDelete && (
                <DropdownMenuItem
                  onClick={() => setDeleteItem(item)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Return both columns and the dialog component
  const DeleteDialog = () => (
    <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            <strong>{(deleteItem as any)?.name || "this item"}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive hover:bg-destructive/90"
            onClick={() => {
              if (deleteItem && actions?.onDelete) {
                actions.onDelete(deleteItem);
                setDeleteItem(null);
              }
            }}
          >
            Yes, Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { columns, DeleteDialog };
}
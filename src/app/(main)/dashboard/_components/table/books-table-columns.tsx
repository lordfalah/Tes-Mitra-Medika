"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { CalendarIcon, Ellipsis, Text } from "lucide-react";
import * as React from "react";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/lib/format";
import type { DataTableRowAction } from "@/types/data-table";
import { TGetBooksWithFilters } from "@/action/action-book";

interface GetProductTableColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TGetBooksWithFilters> | null>
  >;
}

export function getBooksTableColumns({
  setRowAction,
}: GetProductTableColumnsProps): ColumnDef<TGetBooksWithFilters>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
    {
      id: "no",
      header: "No",
      cell: ({ row }) => row.index + 1,
      size: 32,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "title",
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),

      cell: ({ row }) => (
        <div className="w-40 text-wrap break-all">{row.original.title}</div>
      ),

      meta: {
        label: "Title",
        placeholder: "Search Title...",
        variant: "text",
        icon: Text,
      },

      enableColumnFilter: true,
      enableSorting: true,
    },

    {
      id: "description",
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),

      cell: ({ row }) => (
        <div className="w-56 text-wrap break-all">
          {row.original?.description ?? "-"}
        </div>
      ),

      meta: {
        label: "Description",
      },

      enableColumnFilter: false,
      enableSorting: false,
    },

    {
      id: "author",
      accessorKey: "author",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Author" />
      ),

      cell: ({ row }) => (
        <div className="w-40 text-wrap break-all">{row.original.author}</div>
      ),

      meta: {
        label: "Author",
      },
      enableSorting: true,
    },

    {
      id: "publicationYear",
      accessorKey: "publicationYear",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Publication Year" />
      ),

      cell: ({ row }) => (
        <div className="w-40 text-wrap break-all">
          {row.original.publicationYear}
        </div>
      ),

      meta: {
        label: "Publication Year",
      },
      enableSorting: true,
    },

    {
      id: "createdAt",
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => formatDate(cell.getValue<Date>()),
      meta: {
        label: "Created At",
        variant: "dateRange",
        icon: CalendarIcon,
      },
      enableColumnFilter: true,
    },
    {
      id: "actions",
      cell: function Cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="data-[state=open]:bg-muted flex size-8 p-0"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, variant: "update" })}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setRowAction({ row, variant: "delete" })}
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      size: 40,
    },
  ];
}

"use client";

import type { Table } from "@tanstack/react-table";
import { Download, Trash2 } from "lucide-react";
import * as React from "react";
import {
  DataTableActionBar,
  DataTableActionBarAction,
  DataTableActionBarSelection,
} from "@/components/data-table/data-table-action-bar";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { TGetBooksWithFilters } from "@/action/action-book";
import { exportTableToCSV } from "@/lib/export";
import { fetchDeleteBooks } from "@/lib/data/book";
import { useRouter } from "next/navigation";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const actions = ["export", "delete"] as const;

type Action = (typeof actions)[number];

interface BookTableActionBarProps {
  table: Table<TGetBooksWithFilters>;
}

export function BookTableActionBar({ table }: BookTableActionBarProps) {
  const rows = table.getFilteredSelectedRowModel().rows;
  const [isPending, startTransition] = React.useTransition();
  const [currentAction, setCurrentAction] = React.useState<Action | null>(null);
  const router = useRouter();

  const getIsActionPending = React.useCallback(
    (action: Action) => isPending && currentAction === action,
    [isPending, currentAction],
  );

  const onTaskExport = React.useCallback(() => {
    setCurrentAction("export");
    startTransition(() => {
      exportTableToCSV(table, {
        excludeColumns: ["select", "actions"],
        onlySelected: true,
      });
    });
  }, [table]);

  const onTaskDelete = React.useCallback(() => {
    setCurrentAction("delete");
    startTransition(async () => {
      const { data, message } = await fetchDeleteBooks({
        ids: rows.map((row) => row.original.id),
      });

      if (!data || data === 0) {
        toast.error(message);
        return;
      }
      toast.success(`Books deleted total ${data}`, { position: "top-center" });
      table.toggleAllRowsSelected(false);
    });

    router.refresh();
  }, [router, rows, table]);

  return (
    <DataTableActionBar table={table} visible={rows.length > 0}>
      <DataTableActionBarSelection table={table} />
      <Separator
        orientation="vertical"
        className="hidden data-[orientation=vertical]:h-5 sm:block"
      />
      <div className="flex items-center gap-1.5">
        <DataTableActionBarAction
          size="icon"
          tooltip="Export Book"
          isPending={getIsActionPending("export")}
          onClick={onTaskExport}
        >
          <Download />
        </DataTableActionBarAction>
        <DataTableActionBarAction
          size="icon"
          tooltip="Delete Book"
          isPending={getIsActionPending("delete")}
          onClick={onTaskDelete}
        >
          <Trash2 />
        </DataTableActionBarAction>
      </div>
    </DataTableActionBar>
  );
}

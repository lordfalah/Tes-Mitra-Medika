"use client";

import { useMemo, useState } from "react";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { parseAsInteger, useQueryStates } from "nuqs";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableRowAction } from "@/types/data-table";
import UpdateBookSheet from "./update-book-sheet";
import { TGetBooksWithFilters } from "@/action/action-book";
import { getBooksTableColumns } from "./books-table-columns";
import { DeleteBooksDialog } from "./delete-book-dialog";
import { BookTableActionBar } from "./book-table-action-bar";

const DataTableBook: React.FC<{
  data: Array<TGetBooksWithFilters>;
  total: number;
}> = ({ data, total }) => {
  const [rowAction, setRowAction] =
    useState<DataTableRowAction<TGetBooksWithFilters> | null>(null);

  const columns = useMemo(
    () =>
      getBooksTableColumns({
        setRowAction,
      }),
    [],
  );

  const [params] = useQueryStates({
    page: parseAsInteger.withDefault(1),
    perPage: parseAsInteger.withDefault(10),
  });

  const currentPage = params.page;
  const currentPerPage = params.perPage;

  const calculatedPageCount = useMemo(() => {
    if (total === 0) return 1;
    return Math.ceil(total / currentPerPage);
  }, [total, currentPerPage]);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: calculatedPageCount,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"] },
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: currentPerPage,
      },
    },
    shallow: false,
    clearOnDefault: true,
    getRowId: (row) => row.id,
  });

  return (
    <>
      <DataTable table={table} actionBar={<BookTableActionBar table={table} />}>
        <DataTableToolbar table={table}>
          <DataTableSortList table={table} align="start" />
        </DataTableToolbar>
      </DataTable>

      <UpdateBookSheet
        open={rowAction?.variant === "update"}
        onOpenChange={() => setRowAction(null)}
        book={rowAction?.row.original ?? null}
      />

      <DeleteBooksDialog
        open={rowAction?.variant === "delete"}
        onOpenChange={() => setRowAction(null)}
        books={rowAction?.row.original ? [rowAction?.row.original] : []}
        showTrigger={false}
        onSuccess={() => rowAction?.row.toggleSelected(false)}
      />
    </>
  );
};

export default DataTableBook;

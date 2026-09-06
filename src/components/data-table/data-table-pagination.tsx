"use client"

import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"

interface Props<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({ table }: Props<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-muted-foreground">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {table.getPageCount()}
        <select
          className="border rounded px-2 py-1 ml-2"
          value={table.getState().pagination.pageSize}
          onChange={(e) =>
            table.setPageSize(Number(e.target.value))
          }
        >
          {[5, 10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} rows
            </option>
          ))}
        </select>
      </div>
      

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>

        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface DataTableFilterableColumn<TData> {
  id: keyof TData;
  title: string;
  options: { label: string; value: string }[];
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalSearchPlaceholder?: string;
  filterableColumns?: DataTableFilterableColumn<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  globalSearchPlaceholder,
  filterableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0 || !!table.getState().globalFilter;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2 flex-wrap gap-y-2">
        <Input
          placeholder={globalSearchPlaceholder}
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          // FIX: Menggunakan class bawaan Tailwind sesuai saran linter
          className="h-8 w-50 lg:w-75" 
        />

        {filterableColumns.length > 0 &&
          filterableColumns.map(
            (column) =>
              table.getColumn(String(column.id)) && (
                <Select
                  key={String(column.id)}
                  value={(table.getColumn(String(column.id))?.getFilterValue() as string) ?? "all"}
                  onValueChange={(value) => {
                    if (value === "all") {
                      table.getColumn(String(column.id))?.setFilterValue(undefined);
                    } else {
                      table.getColumn(String(column.id))?.setFilterValue(value);
                    }
                  }}
                >
                  {/* FIX: Menggunakan class bawaan Tailwind sesuai saran linter */}
                  <SelectTrigger className="h-8 w-37.5">
                    <SelectValue placeholder={column.title} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All {column.title}</SelectItem>
                    {column.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )
          )}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <DropdownMenu>
        {/* FIX: Menghapus asChild dan menggunakan buttonVariants langsung */}
        <DropdownMenuTrigger className={buttonVariants({ variant: "outline", className: "h-8" })}>
          Columns
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
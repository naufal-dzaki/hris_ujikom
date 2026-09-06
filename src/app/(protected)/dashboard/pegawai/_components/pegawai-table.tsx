"use client";

import { DataTable } from "@/components/data-table/data-table";
import { getColumns } from "./columns";

interface PegawaiTableProps {
  data: any[];
  departments: any[];
  positions: any[];
  filterableColumns: any[];
}

export function PegawaiTable({ data, departments, positions, filterableColumns }: PegawaiTableProps) {
  return (
    <DataTable 
      columns={getColumns(departments, positions)} 
      data={data} 
      globalSearchPlaceholder="Cari nama atau NIP..."
      filterableColumns={filterableColumns}
    />
  );
}
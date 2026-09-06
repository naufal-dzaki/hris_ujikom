"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { PegawaiDialog } from "./pegawai-dialog";
import { deletePegawaiAction } from "@/actions/pegawai";

const CellAction = ({ row, departments, positions }: any) => {
  const pegawai = row.original;

  const handleDelete = async () => {
    if (confirm(`Yakin ingin menghapus pegawai ${pegawai.name}?`)) {
      await deletePegawaiAction(pegawai.id);
    }
  };

  return (
    <div className="flex justify-end">
      <PegawaiDialog 
        pegawai={pegawai} 
        departments={departments} 
        positions={positions} 
        trigger={
          <Button variant="ghost" size="icon" className="mr-2"><Edit className="w-4 h-4 text-blue-500" /></Button>
        } 
      />
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
};

export const getColumns = (departments: any[], positions: any[]): ColumnDef<any, any>[] => [
  {
    accessorKey: "nip",
    header: "NIP",
  },
  {
    accessorKey: "name",
    header: "Nama Lengkap",
  },
  {
    accessorKey: "gender",
    header: "Gender",
    cell: ({ row }: any) => (
      <span>{row.original.gender === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'}</span>
    )
  },
  {
    accessorKey: "department.name",
    id: "department", 
    header: "Departemen",
  },
  {
    accessorKey: "position.name",
    header: "Jabatan",
    cell: ({ row }: any) => (
      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-semibold">
        {row.original.position?.name}
      </span>
    )
  },
  {
    id: "actions",
    cell: ({ row }: any) => <CellAction row={row} departments={departments} positions={positions} />,
  },
];
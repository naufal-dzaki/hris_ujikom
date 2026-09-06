"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Users } from "lucide-react";
import { DepartemenDialog } from "./departemen-dialog";
import { deleteDepartemenAction } from "@/actions/departemen";

const CellAction = ({ row }: any) => {
  const departemen = row.original;

  const handleDelete = async () => {
    if (confirm(`Yakin ingin menghapus departemen ${departemen.name}?`)) {
      const res = await deleteDepartemenAction(departemen.id);
      if (!res.ok) alert(res.error);
    }
  };

  return (
    <div className="flex justify-end">
      <DepartemenDialog 
        departemen={departemen} 
        trigger={<Button variant="ghost" size="icon" className="mr-2"><Edit className="w-4 h-4 text-blue-500" /></Button>} 
      />
      <Button variant="ghost" size="icon" onClick={handleDelete}>
        <Trash2 className="w-4 h-4 text-red-500" />
      </Button>
    </div>
  );
};

export const columns: ColumnDef<any, any>[] = [
  {
    accessorKey: "name",
    header: "Nama Departemen",
    cell: ({ row }: any) => <span className="font-medium">{row.original.name}</span>
  },
  {
    accessorKey: "_count.users",
    header: "Total Pegawai",
    cell: ({ row }: any) => (
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span>{row.original._count?.users || 0} Orang</span>
      </div>
    )
  },
  {
    id: "actions",
    cell: ({ row }: any) => <CellAction row={row} />,
  },
];
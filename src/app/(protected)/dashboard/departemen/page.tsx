import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./_components/columns";
import { DepartemenDialog } from "./_components/departemen-dialog";

export const dynamic = "force-dynamic";

export default async function DepartemenPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") redirect("/dashboard");

  const departemen = await prisma.department.findMany({
    include: { _count: { select: { users: true } } },
    orderBy: { id: "desc" }
  });

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Master Departemen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data divisi atau departemen perusahaan.
          </p>
        </div>
        <DepartemenDialog />
      </div>

      <DataTable 
        columns={columns} 
        data={departemen} 
        globalSearchPlaceholder="Cari nama departemen..."
      />
    </div>
  );
}
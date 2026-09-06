import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PegawaiDialog } from "./_components/pegawai-dialog";
import { PegawaiTable } from "./_components/pegawai-table";

export const dynamic = "force-dynamic";

export default async function PegawaiPage() {
  const session = await auth();
  if ((session?.user as any)?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const pegawais = await prisma.user.findMany({
    where: { role: "PEGAWAI" },
    include: { department: true, position: true },
    orderBy: { createdAt: "desc" }
  });

  const departments = await prisma.department.findMany();
  const positions = await prisma.position.findMany();

  const filterableColumns = [
    {
      id: "department",
      title: "Departemen",
      options: departments.map(d => ({ label: d.name, value: d.name }))
    }
  ];

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Master Data Pegawai</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Kelola data karyawan, departemen, dan hak akses.
          </p>
        </div>
        <PegawaiDialog departments={departments} positions={positions} />
      </div>

      <PegawaiTable 
        data={pegawais} 
        departments={departments} 
        positions={positions} 
        filterableColumns={filterableColumns}
      />
    </div>
  );
}
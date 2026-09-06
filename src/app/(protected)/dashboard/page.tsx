import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, Activity, UserMinus } from "lucide-react";
import { DashboardCharts } from "./_components/dashboard-charts";
import { getDashboardData } from "@/actions/dashboard";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();
  const userRole = (session?.user as any)?.role || "PEGAWAI";
  const userId = session?.user?.id;
  const isAdmin = userRole === "ADMIN";

  const data = await getDashboardData(userId, isAdmin);

  const todayHadir = data.attendanceTrend.length > 0 ? data.attendanceTrend[data.attendanceTrend.length - 1].hadir : 0;
  const todayAbsen = data.attendanceTrend.length > 0 ? data.attendanceTrend[data.attendanceTrend.length - 1].tidakHadir : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isAdmin ? "Manager Dashboard" : "Dashboard Pegawai"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Selamat datang kembali, {session?.user?.name}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isAdmin ? "Kehadiran Hari Ini" : "Absen Masuk Anda (Siklus Berjalan)"}
            </CardTitle>
            <Activity className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isAdmin ? (
                <span className="text-emerald-600">{todayHadir} <span className="text-muted-foreground text-lg">/ {data.totalPegawai}</span></span>
              ) : (
                data.totalPersonalAttendances
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isAdmin ? "Pegawai telah melakukan absensi" : "Data terekam di sistem sejak awal"}
            </p>
          </CardContent>
        </Card>

        {isAdmin && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pegawai Mangkir / Cuti</CardTitle>
                <UserMinus className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-rose-600">{todayAbsen}</div>
                <p className="text-xs text-muted-foreground mt-1">Belum absen hari ini</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Karyawan Aktif</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalPegawai}</div>
                <p className="text-xs text-muted-foreground mt-1">Seluruh departemen</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <DashboardCharts 
        genderData={data.genderData} 
        deptData={data.deptData} 
        attendanceTrend={data.attendanceTrend} 
        isAdmin={isAdmin} 
      />
    </div>
  );
}
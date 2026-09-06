import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { AttendanceForm } from "./_components/attendance-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const dynamic = 'force-dynamic';

export default async function AbsensiPage() {
  const session = await auth();
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const riwayatHariIni = await prisma.attendance.findMany({
    where: {
      userId: session?.user?.id,
      createdAt: { gte: today },
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Absensi Kehadiran</h1>
        <p className="text-muted-foreground mt-1">Lakukan absensi dengan menyertakan foto dan lokasi GPS Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <AttendanceForm />
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status Hari Ini</CardTitle>
            </CardHeader>
            <CardContent>
              {riwayatHariIni.length === 0 ? (
                <div className="text-center p-6 text-muted-foreground border-2 border-dashed rounded-lg">
                  Anda belum melakukan absensi hari ini.
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Jenis</TableHead>
                        <TableHead>Waktu</TableHead>
                        <TableHead>Foto</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {riwayatHariIni.map((absen) => (
                        <TableRow key={absen.id}>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              absen.type === 'MASUK' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {absen.type}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(new Date(absen.createdAt), "HH:mm 'WIB'", { locale: id })}
                          </TableCell>
                          <TableCell>
                            <img 
                              src={absen.photoUrl} 
                              alt="Selfie" 
                              className="w-10 h-10 rounded-md object-cover border"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
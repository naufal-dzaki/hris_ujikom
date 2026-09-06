"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardData(userId: string | undefined, isAdmin: boolean) {
  let totalPegawai = 0, lakiLaki = 0, perempuan = 0;
  let departments: any[] = [];
  let allUsers: any[] = []; 

  if (isAdmin) {
    allUsers = await prisma.user.findMany({
      where: { role: "PEGAWAI" },
      select: { createdAt: true }
    });
    totalPegawai = allUsers.length;
    lakiLaki = await prisma.user.count({ where: { role: "PEGAWAI", gender: "LAKI_LAKI" } });
    perempuan = await prisma.user.count({ where: { role: "PEGAWAI", gender: "PEREMPUAN" } });
    departments = await prisma.department.findMany({
      include: { _count: { select: { users: { where: { role: "PEGAWAI" } } } } }
    });
  }

  let earliestDate = new Date();
  
  if (isAdmin) {
    if (allUsers.length > 0) {
      earliestDate = new Date(Math.min(...allUsers.map(u => new Date(u.createdAt).getTime())));
    }
  } else if (userId) {
    const me = await prisma.user.findUnique({
      where: { id: userId },
      select: { createdAt: true }
    });
    if (me) earliestDate = me.createdAt;
  }
  
  earliestDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 6);

  if (earliestDate > startDate) {
    startDate = new Date(earliestDate);
  }

  const chartDays = [];
  let curr = new Date(startDate);
  while (curr <= today) {
    chartDays.push(new Date(curr));
    curr.setDate(curr.getDate() + 1);
  }

  const attendances = await prisma.attendance.findMany({
    where: {
      createdAt: { gte: startDate },
      type: "MASUK",
      ...(isAdmin ? {} : { userId: userId })
    },
    select: { createdAt: true }
  });

  const attendanceTrend = chartDays.map(day => {
    const dayName = new Intl.DateTimeFormat('id-ID', { weekday: 'short' }).format(day);
    
    const hadirCount = attendances.filter(a => {
      const aDate = new Date(a.createdAt);
      return aDate.getDate() === day.getDate() && aDate.getMonth() === day.getMonth();
    }).length;
    
    let activeUsersThatDay = 1;
    if (isAdmin) {
      activeUsersThatDay = allUsers.filter(u => {
        const uDate = new Date(u.createdAt);
        uDate.setHours(0, 0, 0, 0);
        return uDate <= day;
      }).length;
    }

    const tidakHadirCount = isAdmin ? Math.max(0, activeUsersThatDay - hadirCount) : 0;

    return { 
      name: dayName, 
      hadir: hadirCount,
      tidakHadir: tidakHadirCount
    };
  });

  const genderData = [
    { name: "Laki-laki", value: lakiLaki, fill: "#3b82f6" },
    { name: "Perempuan", value: perempuan, fill: "#ec4899" }
  ];
  const deptData = departments.map(d => ({ name: d.name, total: d._count.users }));

  return {
    totalPegawai,
    perempuan,
    attendanceTrend,
    genderData,
    deptData,
    totalPersonalAttendances: attendances.length
  };
}
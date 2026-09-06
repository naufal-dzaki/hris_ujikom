"use client";

import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, CartesianGrid, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartProps {
  genderData: { name: string; value: number; fill: string }[];
  deptData: { name: string; total: number }[];
  attendanceTrend: { name: string; hadir: number; tidakHadir: number }[];
  isAdmin: boolean;
}

export function DashboardCharts({ genderData, deptData, attendanceTrend, isAdmin }: ChartProps) {
  return (
    <div className="space-y-6 mt-6">
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isAdmin ? "Perbandingan Kehadiran Pegawai (7 Hari Terakhir)" : "Tren Kehadiran Anda (7 Hari Terakhir)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={attendanceTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHadir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorTidakHadir" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              {isAdmin && <Legend verticalAlign="top" height={36}/>}
              
              <Area 
                type="monotone" 
                dataKey="hadir" 
                stackId="1" 
                stroke="#10b981" 
                fill="url(#colorHadir)" 
                name="Hadir" 
              />
              {isAdmin && (
                <Area 
                  type="monotone" 
                  dataKey="tidakHadir" 
                  stackId="1" 
                  stroke="#f43f5e" 
                  fill="url(#colorTidakHadir)" 
                  name="Tidak Hadir" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Perbandingan Gender Pegawai</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Orang`, "Jumlah"]} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sebaran Pegawai per Departemen</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Total Pegawai" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
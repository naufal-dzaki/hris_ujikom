"use server";

import { err, ok, Result } from "@/lib/response";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

export async function submitAttendanceAction(
  prevState: any,
  formData: FormData
): Promise<Result<string, any>> {
  try {
    const session = await auth();
    if (!session?.user?.id) return err("Silakan login terlebih dahulu.");

    const type = formData.get("type") as "MASUK" | "PULANG";
    const file = formData.get("photo") as File;
    
    // const latitude = formData.get("latitude") as string;
    // const longitude = formData.get("longitude") as string;

    if (!file || file.size === 0) return err("Foto selfie wajib disertakan!");
    
    // if (!latitude || !longitude) return err("Gagal mendapatkan lokasi GPS. Pastikan izin lokasi aktif.");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        userId: session.user.id,
        type: type,
        createdAt: { gte: today },
      },
    });

    if (existingAttendance) {
      return err(`Anda sudah melakukan absen ${type} hari ini!`);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${session.user.id}-${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    await writeFile(path.join(uploadDir, filename), buffer);
    const photoUrl = `/uploads/${filename}`;

    await prisma.attendance.create({
      data: {
        userId: session.user.id,
        type,
        photoUrl,
        // latitude: parseFloat(latitude),
        // longitude: parseFloat(longitude),
      },
    });

    return ok(`Absen ${type} berhasil dicatat!`);
  } catch (error) {
    console.error("Attendance Error:", error);
    return err("Terjadi kesalahan pada server saat mencatat absensi.");
  }
}
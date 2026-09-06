"use server";

import { err, ok, Result } from "@/lib/response";
import { PegawaiSchema } from "@/schemas/pegawai";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function savePegawaiAction(
  prevState: any,
  formData: FormData
): Promise<Result<string, any>> {
  const rawData = Object.fromEntries(formData);
  const validated = PegawaiSchema.safeParse(rawData);

  if (!validated.success) {
    return err("Validasi gagal", validated.error.flatten().fieldErrors);
  }

  const data = validated.data;

  try {
    if (data.id) {
      const updateData: any = {
        nip: data.nip,
        name: data.name,
        email: data.email,
        gender: data.gender,
        phone: data.phone,
        departmentId: data.departmentId,
        positionId: data.positionId,
      };

      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      await prisma.user.update({ where: { id: data.id }, data: updateData });
      revalidatePath("/dashboard/pegawai");
      return ok("Data pegawai berhasil diperbarui!");
    } else {
      if (!data.password) return err("Password wajib diisi untuk pegawai baru!");
      
      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      await prisma.user.create({
        data: {
          nip: data.nip,
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: "PEGAWAI",
          gender: data.gender,
          phone: data.phone,
          departmentId: data.departmentId,
          positionId: data.positionId,
        }
      });
      revalidatePath("/dashboard/pegawai");
      return ok("Pegawai baru berhasil ditambahkan!");
    }
  } catch (error: any) {
    if (error.code === 'P2002') return err("Email atau NIP sudah digunakan.");
    return err("Terjadi kesalahan pada server.");
  }
}

export async function deletePegawaiAction(id: string): Promise<Result<string, any>> {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/pegawai");
    return ok("Pegawai berhasil dihapus!");
  } catch (error) {
    return err("Gagal menghapus pegawai.");
  }
}
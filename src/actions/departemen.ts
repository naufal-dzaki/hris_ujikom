"use server";

import { err, ok, Result } from "@/lib/response";
import { DepartemenSchema } from "@/schemas/departemen";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveDepartemenAction(
  prevState: any,
  formData: FormData
): Promise<Result<string, any>> {
  const rawData = Object.fromEntries(formData);
  const validated = DepartemenSchema.safeParse(rawData);

  if (!validated.success) {
    return err("Validasi gagal", validated.error.flatten().fieldErrors);
  }

  const { id, name } = validated.data;

  try {
    if (id) {
      await prisma.department.update({ where: { id }, data: { name } });
      revalidatePath("/dashboard/departemen");
      return ok("Departemen berhasil diperbarui!");
    } else {
      await prisma.department.create({ data: { name } });
      revalidatePath("/dashboard/departemen");
      return ok("Departemen baru berhasil ditambahkan!");
    }
  } catch (error) {
    return err("Terjadi kesalahan pada server.");
  }
}

export async function deleteDepartemenAction(id: number): Promise<Result<string, any>> {
  try {
    await prisma.department.delete({ where: { id } });
    revalidatePath("/dashboard/departemen");
    return ok("Departemen berhasil dihapus!");
  } catch (error) {
    return err("Gagal menghapus! Pastikan tidak ada pegawai yang terikat di departemen ini.");
  }
}
"use server";

import { err, ok, Result } from "@/lib/response";
import { ChangePasswordSchema } from "@/schemas/user";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function changePasswordAction(
  prevState: any,
  formData: FormData
): Promise<Result<string, any>> {
  const session = await auth();
  if (!session?.user?.id) {
    return err("Unauthorized. Silakan login kembali.");
  }

  const rawData = Object.fromEntries(formData);
  const validated = ChangePasswordSchema.safeParse(rawData);

  if (!validated.success) {
    return err("Validasi gagal", validated.error.flatten().fieldErrors);
  }

  const { currentPassword, newPassword } = validated.data;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return err("Pengguna tidak ditemukan.");
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return err("Password saat ini salah.", {
        currentPassword: ["Password saat ini salah."]
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return ok("Password berhasil diubah!");
  } catch (error) {
    console.error("Change Password Error:", error);
    return err("Terjadi kesalahan pada server. Coba lagi nanti.");
  }
}
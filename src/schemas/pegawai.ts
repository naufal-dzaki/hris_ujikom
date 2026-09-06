import { z } from "zod";
import { Gender } from "@prisma/client";

export const PegawaiSchema = z.object({
  id: z.string().optional(),
  nip: z.string().min(1, "NIP wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().optional(),
  
  gender: z.nativeEnum(Gender, { message: "Pilih jenis kelamin" }),
  
  phone: z.string().optional(),
  departmentId: z.coerce.number().min(1, "Departemen wajib dipilih"),
  positionId: z.coerce.number().min(1, "Jabatan wajib dipilih"),
});
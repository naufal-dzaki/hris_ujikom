import { z } from "zod";

export const DepartemenSchema = z.object({
  id: z.coerce.number().optional(),
  name: z.string().min(1, "Nama Departemen wajib diisi"),
});
import { z } from "zod";

// Schema untuk membuat atau memperbarui buku
export const bookSchema = z.object({
  title: z
    .string()
    .min(1, "Title tidak boleh kosong")
    .max(255, "Title maksimal 255 karakter"),
  author: z
    .string()
    .min(1, "Author tidak boleh kosong")
    .max(255, "Author maksimal 255 karakter"),
  publicationYear: z
    .number()
    .int("Publication year harus angka bulat")
    .gte(1000, "Publication year minimal 1000")
    .lte(9999, "Publication year maksimal 9999"),

  description: z.string().optional(),
});

export type TBookSchema = z.infer<typeof bookSchema>;

import { z } from "zod";

const usernameRegex = /^[a-zA-Z0-9]+$/;
const displayNameRegex = /^[a-zA-Z0-9 ]+$/;

export const registerSchema = z.object({
  name: z.string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .regex(displayNameRegex, "Nama hanya boleh mengandung huruf, angka, dan spasi")
    .trim(),
  email: z.string().email("Format email tidak valid").toLowerCase().trim(),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password terlalu panjang")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
    .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
    .regex(/[^a-zA-Z0-9]/, "Password harus mengandung minimal 1 karakter spesial"),
});

export const registerApiSchema = z.object({
  username: z.string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(usernameRegex, "Username hanya boleh mengandung huruf dan angka (tanpa spasi)")
    .trim(),
  email: z.string().email("Format email tidak valid").toLowerCase().trim(),
  password: z.string()
    .min(8, "Password minimal 8 karakter")
    .max(100, "Password terlalu panjang")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
    .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
    .regex(/[^a-zA-Z0-9]/, "Password harus mengandung minimal 1 karakter spesial"),
});

export const loginSchema = z.object({
  // Normalize: strip spaces + lowercase, same as how usernames are derived on register.
  // So "Toni Tono", "tonitono", "ToniTono" all resolve to the same username.
  username: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .trim()
    .transform((v) => v.replace(/\s+/g, "").toLowerCase()),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

// loginApiSchema was identical to loginSchema — use loginSchema directly.

export const changePasswordSchema = z.object({
  currentPassword: z.string()
    .min(1, "Password saat ini tidak boleh kosong")
    .max(100, "Password terlalu panjang")
    .trim(),
  newPassword: z.string()
    .min(8, "Password baru minimal 8 karakter")
    .max(100, "Password terlalu panjang")
    .regex(/[A-Z]/, "Password harus mengandung minimal 1 huruf kapital")
    .regex(/[a-z]/, "Password harus mengandung minimal 1 huruf kecil")
    .regex(/[0-9]/, "Password harus mengandung minimal 1 angka")
    .regex(/[^a-zA-Z0-9]/, "Password harus mengandung minimal 1 karakter spesial")
    .trim(),
});

export const updateProfileSchema = z.object({
  username: z.string()
    .min(3, "Username minimal 3 karakter")
    .max(50, "Username maksimal 50 karakter")
    .regex(usernameRegex, "Username hanya boleh mengandung huruf dan angka (tanpa spasi)")
    .trim()
    .optional(),
  email: z.string().email("Format email tidak valid").toLowerCase().trim().optional(),
  displayName: z.string()
    .min(3, "Nama tampilan minimal 3 karakter")
    .max(50, "Nama tampilan maksimal 50 karakter")
    .regex(displayNameRegex, "Nama tampilan hanya boleh mengandung huruf, angka, dan spasi")
    .trim()
    .optional(),
  avatarUrl: z.string().url("Format URL tidak valid").optional().or(z.literal("")),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type RegisterApiData = z.infer<typeof registerApiSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

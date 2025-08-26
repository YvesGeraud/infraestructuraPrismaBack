import { z } from "zod";

// Esquemas para validación de usuarios
export const createUserSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es requerido"),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .max(100, "La contraseña es demasiado larga"),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .trim(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido es demasiado largo")
    .trim(),
  role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
});

export const updateUserSchema = z.object({
  email: z.string().email("Email inválido").optional(),
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre es demasiado largo")
    .trim()
    .optional(),
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido es demasiado largo")
    .trim()
    .optional(),
  isActive: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual es requerida"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres")
    .max(100, "La nueva contraseña es demasiado larga"),
});

export const loginSchema = z.object({
  email: z.string().email("Email inválido").min(1, "Email es requerido"),
  password: z.string().min(1, "Contraseña es requerida"),
});

// Esquemas para query parameters
export const userFiltersSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  isActive: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  emailVerified: z
    .string()
    .transform((val) => val === "true")
    .pipe(z.boolean())
    .optional(),
  search: z.string().optional(),
});

// Importar schemas comunes
export { paginationSchema, idParamSchema } from "./commonSchemas";

// Tipos inferidos
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UserFiltersInput = z.infer<typeof userFiltersSchema>;

// Importar tipos comunes
export type { PaginationInput, IdParam } from "./commonSchemas";

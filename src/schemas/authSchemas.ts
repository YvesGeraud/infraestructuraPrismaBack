import { z } from "zod";

// ===== SCHEMAS PARA AUTENTICACIÓN =====

// Schema para login
export const esquemaLogin = z.object({
  email: z
    .string()
    .email("Formato de email inválido")
    .min(1, "Email es requerido"),
  password: z
    .string()
    .min(1, "Contraseña es requerida")
    .max(100, "Contraseña muy larga"),
});

// Schema para refresh token
export const esquemaRefreshToken = z.object({
  token: z.string().min(1, "Token es requerido"),
});

// Schema para logout
export const esquemaLogout = z.object({
  token: z.string().optional(), // Token opcional para logout
});

// Tipos derivados de los schemas
export type LoginInput = z.infer<typeof esquemaLogin>;
export type RefreshTokenInput = z.infer<typeof esquemaRefreshToken>;
export type LogoutInput = z.infer<typeof esquemaLogout>;

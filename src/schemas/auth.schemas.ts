/**
 * @fileoverview Esquemas de validación para autenticación
 *
 * Estos esquemas definen la estructura y validaciones para:
 * - Login de usuarios
 * - Refresh tokens
 * - Logout
 * - Registro de usuarios (futuro)
 *
 * Usa Zod para validación tipo-segura con mensajes en español
 */

import { z } from "zod";

// ===== ESQUEMAS BASE =====

/**
 * Esquema para validar credenciales de login
 */
export const esquemaLogin = z.object({
  usuario: z
    .string()
    .min(1, "El nombre de usuario es requerido")
    .max(100, "El nombre de usuario no puede exceder 100 caracteres")
    .regex(
      /^[a-zA-Z0-9_.-]+$/,
      "El usuario solo puede contener letras, números, puntos, guiones y guiones bajos"
    ),
  contrasena: z
    .string()
    .min(1, "La contraseña es requerida")
    .max(255, "La contraseña no puede exceder 255 caracteres"),
});

/**
 * Esquema para validar refresh token
 * Usa el accessToken actual como refreshToken
 */
export const esquemaRefreshToken = z.object({
  refreshToken: z
    .string()
    .min(1, "El refresh token es requerido")
    .refine((token) => {
      try {
        // Verificar que sea un JWT válido (tiene 3 partes separadas por puntos)
        const parts = token.split(".");
        return parts.length === 3;
      } catch {
        return false;
      }
    }, "El refresh token debe ser un JWT válido"),
});

/**
 * Esquema para logout
 */
export const esquemaLogout = z.object({
  // Opcional: puede hacer logout de una sesión específica o todas
  sesionId: z.string().uuid("ID de sesión debe ser UUID válido").optional(),
  cerrarTodasLasSesiones: z.boolean().default(false),
});

/**
 * Esquema para verificar token
 */
export const esquemaVerificarToken = z.object({
  token: z.string().min(1, "El token es requerido"),
});

// ===== ESQUEMAS DE RESPUESTA =====

/**
 * Esquema que define la estructura de respuesta exitosa de login
 */
export const esquemaRespuestaLogin = z.object({
  exito: z.literal(true),
  mensaje: z.string(),
  datos: z.object({
    // Información del usuario (sin datos sensibles)
    usuario: z.object({
      id_ct_usuario: z.number(),
      uuid_usuario: z.string().uuid(),
      usuario: z.string(),
      email: z.string().email().nullable(),
      ultimo_login: z.date().nullable(),
      fecha_registro: z.date().nullable(),
    }),

    // Tokens de autenticación (sin refresh token)
    tokens: z.object({
      accessToken: z.string(),
      tipoToken: z.literal("Bearer"),
      expiraEn: z.number(), // Segundos hasta expiración
    }),

    // Información de la sesión
    sesion: z.object({
      id_sesion: z.number(), // Int - ID de la sesión en BD
      jti: z.string().uuid(),
      fecha_expiracion: z.date(),
      ip_origen: z.string().nullable(),
      dispositivo: z.string().nullable(),
    }),
  }),
  meta: z
    .object({
      tiempoRespuesta: z.number().optional(),
      version: z.string().optional(),
    })
    .optional(),
});

/**
 * Esquema para respuesta de refresh token
 * @deprecated Refresh tokens han sido eliminados del sistema
 */
export const esquemaRespuestaRefresh = z.object({
  exito: z.literal(true),
  mensaje: z.string(),
  datos: z.object({
    accessToken: z.string(),
    refreshToken: z.string().uuid(), // Nuevo refresh token
    tipoToken: z.literal("Bearer"),
    expiraEn: z.number(),
    jti: z.string().uuid(), // Nuevo JTI
  }),
});

/**
 * Esquema para respuesta de logout
 */
export const esquemaRespuestaLogout = z.object({
  exito: z.literal(true),
  mensaje: z.string(),
  datos: z.object({
    sesionesTerminadas: z.number(),
  }),
});

/**
 * Esquema para información del usuario actual
 */
export const esquemaUsuarioActual = z.object({
  exito: z.literal(true),
  mensaje: z.string(),
  datos: z.object({
    usuario: z.object({
      id_ct_usuario: z.number(),
      uuid_usuario: z.string().uuid(),
      usuario: z.string(),
      email: z.string().email().nullable(),
      estado: z.boolean(),
      ultimo_login: z.date().nullable(),
      fecha_registro: z.date().nullable(),
      fecha_modificacion: z.date().nullable(),
    }),
    sesionActual: z.object({
      id_sesion: z.number(), // Int - ID de la sesión en BD
      jti: z.string().uuid(),
      fecha_creacion: z.date(),
      fecha_expiracion: z.date(),
      fecha_ultimo_uso: z.date().nullable(),
      ip_origen: z.string().nullable(),
      dispositivo: z.string().nullable(),
    }),
    estadisticasSesiones: z.object({
      sesionesActivas: z.number(),
      ultimaActividad: z.date().nullable(),
    }),
  }),
});

// ===== TIPOS TYPESCRIPT =====

export type LoginInput = z.infer<typeof esquemaLogin>;
export type RefreshTokenInput = z.infer<typeof esquemaRefreshToken>;
export type LogoutInput = z.infer<typeof esquemaLogout>;
export type VerificarTokenInput = z.infer<typeof esquemaVerificarToken>;

export type RespuestaLogin = z.infer<typeof esquemaRespuestaLogin>;
export type RespuestaRefresh = z.infer<typeof esquemaRespuestaRefresh>;
export type RespuestaLogout = z.infer<typeof esquemaRespuestaLogout>;
export type UsuarioActual = z.infer<typeof esquemaUsuarioActual>;

// ===== ESQUEMAS DE VALIDACIÓN DE PARÁMETROS =====

/**
 * Esquema para validar UUID en parámetros de ruta
 */
export const esquemaUuidParam = z.object({
  id: z.string().uuid("Debe ser un UUID válido"),
});

/**
 * Esquema para validar JTI en parámetros
 */
export const esquemaJtiParam = z.object({
  jti: z.string().uuid("JTI debe ser un UUID válido"),
});

// ===== ESQUEMAS PARA FUTURAS FUNCIONALIDADES =====

/**
 * Esquema para cambio de contraseña (futuro)
 */
export const esquemaCambioContrasena = z
  .object({
    contrasenaActual: z.string().min(1, "La contraseña actual es requerida"),
    contrasenaNueva: z
      .string()
      .min(8, "La nueva contraseña debe tener al menos 8 caracteres")
      .max(255, "La contraseña no puede exceder 255 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "La contraseña debe contener al menos una minúscula, una mayúscula y un número"
      ),
    confirmarContrasena: z.string(),
  })
  .refine((data) => data.contrasenaNueva === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

/**
 * Esquema para recuperación de contraseña (futuro)
 */
export const esquemaRecuperarContrasena = z.object({
  email: z.string().email("Debe ser un email válido"),
});

/**
 * Esquema para restablecer contraseña (futuro)
 */
export const esquemaRestablecerContrasena = z
  .object({
    token: z.string().min(1, "El token de recuperación es requerido"),
    contrasenaNueva: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .max(255, "La contraseña no puede exceder 255 caracteres"),
    confirmarContrasena: z.string(),
  })
  .refine((data) => data.contrasenaNueva === data.confirmarContrasena, {
    message: "Las contraseñas no coinciden",
    path: ["confirmarContrasena"],
  });

// ===== UTILIDADES =====

/**
 * Función helper para validar que un string sea un JWT válido
 */
export const esJwtValido = (token: string): boolean => {
  const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
  return jwtRegex.test(token);
};

/**
 * Función helper para extraer información del JWT sin verificar
 * (solo para logging/debugging)
 */
export const extraerInfoJwt = (token: string) => {
  try {
    const [header, payload] = token.split(".");
    return {
      header: JSON.parse(Buffer.from(header, "base64").toString()),
      payload: JSON.parse(Buffer.from(payload, "base64").toString()),
    };
  } catch {
    return null;
  }
};

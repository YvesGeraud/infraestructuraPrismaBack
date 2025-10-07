/**
 * @fileoverview Middleware de Autenticación con JWT + UUID
 *
 * Este middleware maneja la verificación de tokens JWT con las siguientes características:
 * ✅ Verificación de firma JWT con secreto compartido
 * ✅ Validación de JTI (UUID) en base de datos para sesiones activas
 * ✅ Verificación de expiración de tokens
 * ✅ Validación de estado de usuario (activo/bloqueado)
 * ✅ Actualización de "último uso" de sesión
 * ✅ Headers de seguridad automáticos
 * ✅ Manejo robusto de errores
 *
 * 🔐 FLUJO DE VERIFICACIÓN:
 * 1. Extraer token del header Authorization
 * 2. Verificar firma JWT con secreto
 * 3. Validar JTI en tabla ct_sesion (sesión activa)
 * 4. Verificar estado del usuario
 * 5. Actualizar fecha_ultimo_uso
 * 6. Agregar información a req.user
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { jwtConfig } from "../config/env";
import { enviarRespuestaError } from "../utils/responseUtils";

const prisma = new PrismaClient();

// ===== INTERFACES =====

/**
 * Payload decodificado del JWT
 */
interface PayloadJwt {
  sub: number; // ID del usuario
  uuid: string; // UUID del usuario
  usuario: string; // Nombre de usuario
  jti: string; // JWT ID único (UUID)
  iat: number; // Issued at
  exp: number; // Expiration
  iss: string; // Issuer
}

/**
 * Información del usuario autenticado que se agrega a req.user
 */
export interface UsuarioAutenticado {
  id_ct_usuario: number;
  uuid_usuario: string;
  usuario: string;
  email: string | null;
  estado: boolean;
  jti: string;
  id_sesion: string;
  ip_origen: string | null;
  fecha_expiracion: Date;
}

/**
 * Extensión del Request para incluir información del usuario autenticado
 */
export interface RequestAutenticado extends Request {
  user: UsuarioAutenticado;
}

// ===== MIDDLEWARE PRINCIPAL =====

/**
 * 🔐 MIDDLEWARE DE VERIFICACIÓN DE AUTENTICACIÓN
 *
 * Verifica que el usuario tenga un token válido y una sesión activa
 */
export const verificarAutenticacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. 🎫 EXTRAER TOKEN DEL HEADER
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return enviarRespuestaError(res, "Token de acceso requerido", 401, {
        codigo: "TOKEN_REQUERIDO",
        header: "Authorization: Bearer <token>",
        ayuda: "Incluye el token JWT en el header Authorization",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return enviarRespuestaError(res, "Formato de token inválido", 401, {
        codigo: "FORMATO_TOKEN_INVALIDO",
        formato: "Authorization: Bearer <token>",
        recibido: authHeader.substring(0, 20) + "...",
      });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // 2. 🔍 VERIFICAR FIRMA DEL JWT
    let payload: PayloadJwt;

    try {
      const verifiedPayload = jwt.verify(token, jwtConfig.secret, {
        algorithms: ["HS256"],
        issuer: "infraestructura-system",
      });

      payload = verifiedPayload as unknown as PayloadJwt;
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return enviarRespuestaError(res, "Token expirado", 401, {
          codigo: "TOKEN_EXPIRADO",
          expiro: jwtError.expiredAt,
          ayuda: "Usa el refresh token para obtener un nuevo access token",
        });
      }

      if (jwtError instanceof jwt.JsonWebTokenError) {
        return enviarRespuestaError(res, "Token JWT inválido", 401, {
          codigo: "JWT_INVALIDO",
          razon: jwtError.message,
        });
      }

      throw jwtError; // Re-lanzar otros errores
    }

    // 3. 🗄️ VALIDAR JTI EN BASE DE DATOS (SESIÓN ACTIVA)
    const sesion = await prisma.ct_sesion.findUnique({
      where: { jti: payload.jti },
      include: {
        ct_usuario: {
          select: {
            id_ct_usuario: true,
            uuid_usuario: true,
            usuario: true,
            email: true,
            estado: true,
            bloqueado_hasta: true,
          },
        },
      },
    });

    if (!sesion) {
      return enviarRespuestaError(res, "Sesión no encontrada o inválida", 401, {
        codigo: "SESION_INVALIDA",
        jti: payload.jti,
        ayuda: "La sesión puede haber sido cerrada o el token revocado",
      });
    }

    // 4. ✅ VERIFICAR ESTADO DE LA SESIÓN
    if (!sesion.activa) {
      return enviarRespuestaError(res, "Sesión inactiva", 401, {
        codigo: "SESION_INACTIVA",
        motivo: "La sesión ha sido cerrada",
        ayuda: "Inicia sesión nuevamente",
      });
    }

    // 5. ⏰ VERIFICAR EXPIRACIÓN DE LA SESIÓN
    const ahora = new Date();
    if (sesion.fecha_expiracion < ahora) {
      // Marcar sesión como inactiva
      await prisma.ct_sesion.update({
        where: { jti: payload.jti },
        data: { activa: false },
      });

      return enviarRespuestaError(res, "Sesión expirada", 401, {
        codigo: "SESION_EXPIRADA",
        expiro: sesion.fecha_expiracion,
        ayuda: "Usa el refresh token para renovar la sesión",
      });
    }

    // 6. 👤 VERIFICAR ESTADO DEL USUARIO
    const usuario = sesion.ct_usuario;

    if (!usuario.estado) {
      return enviarRespuestaError(res, "Usuario inactivo", 401, {
        codigo: "USUARIO_INACTIVO",
        estado: usuario.estado,
        ayuda: "Contacta al administrador del sistema",
      });
    }

    if (usuario.bloqueado_hasta && usuario.bloqueado_hasta > ahora) {
      return enviarRespuestaError(res, "Usuario temporalmente bloqueado", 401, {
        codigo: "USUARIO_BLOQUEADO",
        bloqueadoHasta: usuario.bloqueado_hasta,
        ayuda: "Espera a que expire el bloqueo o contacta al administrador",
      });
    }

    // 7. 🔄 ACTUALIZAR ÚLTIMO USO DE LA SESIÓN
    // Ejecutar en background para no afectar la respuesta
    prisma.ct_sesion
      .update({
        where: { jti: payload.jti },
        data: { fecha_ultimo_uso: ahora },
      })
      .catch((error) => {
        console.error("❌ Error actualizando último uso de sesión:", error);
      });

    // 8. ✅ AGREGAR INFORMACIÓN DEL USUARIO A LA REQUEST
    (req as RequestAutenticado).user = {
      id_ct_usuario: usuario.id_ct_usuario,
      uuid_usuario: usuario.uuid_usuario,
      usuario: usuario.usuario,
      email: usuario.email,
      estado: usuario.estado,
      jti: payload.jti,
      id_sesion: sesion.id_ct_sesion,
      ip_origen: sesion.ip_origen,
      fecha_expiracion: sesion.fecha_expiracion,
    };

    // 9. 🛡️ AGREGAR HEADERS DE SEGURIDAD
    res.set({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "X-XSS-Protection": "1; mode=block",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    });

    next();
  } catch (error) {
    console.error("❌ Error en middleware de autenticación:", error);

    return enviarRespuestaError(res, "Error interno de autenticación", 500, {
      codigo: "ERROR_INTERNO_AUTH",
      ayuda: "Contacta al administrador del sistema",
    });
  }
};

// ===== MIDDLEWARES OPCIONALES =====

/**
 * 🔓 MIDDLEWARE DE AUTENTICACIÓN OPCIONAL
 *
 * Similar al middleware principal, pero no falla si no hay token.
 * Útil para endpoints que pueden funcionar con o sin autenticación.
 */
export const autenticacionOpcional = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  // Si no hay header de autorización, continuar sin autenticación
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  // Si hay header, intentar autenticar
  // Si falla, continuar sin autenticación (no retornar error)
  try {
    await verificarAutenticacion(req, res, next);
  } catch (error) {
    console.warn(
      "⚠️  Autenticación opcional falló, continuando sin auth:",
      error
    );
    next();
  }
};

/**
 * 🔒 MIDDLEWARE PARA VERIFICAR ROLES ESPECÍFICOS
 *
 * Verifica que el usuario autenticado tenga un rol específico
 * (Para implementar cuando se agregue sistema de roles)
 */
export const verificarRol = (rolesPermitidos: string[]) => {
  return async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // TODO: Implementar cuando se agregue sistema de roles
    // Por ahora, todos los usuarios autenticados pasan
    next();
  };
};

/**
 * 🏢 MIDDLEWARE PARA VERIFICAR PERMISOS POR RECURSO
 *
 * Verifica que el usuario tenga permisos para acceder a un recurso específico
 * (Para implementar cuando se agregue sistema de permisos granular)
 */
export const verificarPermiso = (recurso: string, accion: string) => {
  return async (
    req: RequestAutenticado,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    // TODO: Implementar sistema de permisos granular
    // Por ahora, todos los usuarios autenticados pasan
    next();
  };
};

// ===== UTILIDADES =====

/**
 * 🔍 EXTRAER INFORMACIÓN DEL DISPOSITIVO
 *
 * Extrae información útil del User-Agent para auditoría
 */
export const extraerInfoDispositivo = (req: Request) => {
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.ip || req.connection.remoteAddress || "unknown";

  // Detección básica de dispositivo
  let dispositivo = "desktop";
  if (/mobile/i.test(userAgent)) {
    dispositivo = "mobile";
  } else if (/tablet/i.test(userAgent)) {
    dispositivo = "tablet";
  }

  return {
    ip,
    userAgent,
    dispositivo,
  };
};

/**
 * 🧹 TAREA DE LIMPIEZA DE SESIONES EXPIRADAS
 *
 * Ejecuta limpieza automática de sesiones expiradas cada hora
 */
export const inicializarLimpiezaSesiones = () => {
  const INTERVALO_LIMPIEZA = 60 * 60 * 1000; // 1 hora

  setInterval(async () => {
    try {
      const ahora = new Date();

      const resultado = await prisma.ct_sesion.updateMany({
        where: {
          fecha_expiracion: { lt: ahora },
          activa: true,
        },
        data: { activa: false },
      });

      if (resultado.count > 0) {
        console.log(
          `🧹 Auth: Marcadas ${resultado.count} sesiones expiradas como inactivas`
        );
      }
    } catch (error) {
      console.error("❌ Error en limpieza de sesiones:", error);
    }
  }, INTERVALO_LIMPIEZA);

  console.log("✅ Limpieza automática de sesiones inicializada (cada 1h)");
};

/**
 * @fileoverview Controlador de Autenticación
 *
 * Maneja todos los endpoints relacionados con autenticación:
 * ✅ Login de usuarios con rate limiting
 * ✅ Refresh de tokens con rotación segura
 * ✅ Logout individual y global
 * ✅ Información del usuario actual
 * ✅ Verificación de estado de tokens
 * ✅ Gestión de sesiones activas
 *
 * Integra con:
 * - AuthService para lógica de negocio
 * - Rate limiting para protección
 * - Middleware de autenticación
 * - Esquemas Zod para validación
 */

import { Request, Response } from "express";
import AuthService, { ErrorAuth } from "../services/auth.service";
import {
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
} from "../schemas/auth.schemas";
import {
  enviarRespuestaExitosa,
  enviarRespuestaError,
} from "../utils/responseUtils";
import {
  RequestAutenticado,
  extraerInfoDispositivo,
} from "../middleware/authMiddleware";

export class AuthController {
  /**
   * 🔐 LOGIN DE USUARIO
   *
   * POST /api/auth/login
   *
   * Autentica un usuario y devuelve tokens JWT + refresh token
   * Incluye rate limiting y auditoría de dispositivos
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credenciales: LoginInput = req.body;
      const infoDispositivo = extraerInfoDispositivo(req);

      console.log(
        `🔐 Intento de login: ${credenciales.usuario} desde ${infoDispositivo.ip}`
      );

      const resultado = await AuthService.login(credenciales, infoDispositivo);

      // Log de éxito (sin información sensible)
      console.log(
        `✅ Login exitoso: ${credenciales.usuario} (${resultado.datos.usuario.uuid_usuario})`
      );

      enviarRespuestaExitosa(res, {
        datos: resultado.datos,
        mensaje: resultado.mensaje,
        metaAdicional: resultado.meta,
      });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        console.warn(
          `⚠️  Login fallido: ${req.body.usuario} - ${error.message}`
        );

        return enviarRespuestaError(res, error.message, error.statusCode, {
          codigo: error.codigo,
        });
      }

      console.error("❌ Error interno en login:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }

  /**
   * 🔄 REFRESH TOKEN
   *
   * POST /api/auth/refresh
   *
   * Renueva el access token usando un refresh token válido
   * Implementa rotación de refresh tokens para mayor seguridad
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const input: RefreshTokenInput = req.body;

      console.log(
        `🔄 Solicitud de refresh token: ${input.refreshToken.substring(
          0,
          8
        )}...`
      );

      const resultado = await AuthService.refreshToken(input);

      console.log(`✅ Token renovado exitosamente: JTI ${resultado.datos.jti}`);

      enviarRespuestaExitosa(res, {
        datos: resultado.datos,
        mensaje: resultado.mensaje,
      });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        console.warn(`⚠️  Refresh token fallido: ${error.message}`);

        return enviarRespuestaError(res, error.message, error.statusCode, {
          codigo: error.codigo,
        });
      }

      console.error("❌ Error interno en refresh token:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }

  /**
   * 🚪 LOGOUT DE USUARIO
   *
   * POST /api/auth/logout
   *
   * Cierra sesión(es) del usuario y revoca refresh tokens
   * Puede cerrar una sesión específica o todas las sesiones
   */
  async logout(req: RequestAutenticado, res: Response): Promise<void> {
    try {
      const input: LogoutInput = req.body;
      const jtiActual = req.user.jti;

      console.log(
        `🚪 Solicitud de logout: Usuario ${req.user.usuario} (JTI: ${jtiActual})`
      );

      const resultado = await AuthService.logout(input, jtiActual);

      console.log(
        `✅ Logout exitoso: ${resultado.datos.sesionesTerminadas} sesiones cerradas, ${resultado.datos.tokensRevocados} tokens revocados`
      );

      enviarRespuestaExitosa(res, {
        datos: resultado.datos,
        mensaje: resultado.mensaje,
      });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        console.warn(`⚠️  Logout fallido: ${error.message}`);

        return enviarRespuestaError(res, error.message, error.statusCode, {
          codigo: error.codigo,
        });
      }

      console.error("❌ Error interno en logout:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }

  /**
   * 👤 OBTENER USUARIO ACTUAL
   *
   * GET /api/auth/me
   *
   * Retorna información del usuario autenticado y estadísticas de sesión
   * Requiere autenticación válida
   */
  async obtenerUsuarioActual(
    req: RequestAutenticado,
    res: Response
  ): Promise<void> {
    try {
      const jti = req.user.jti;

      console.log(`👤 Solicitud de usuario actual: JTI ${jti}`);

      const resultado = await AuthService.obtenerUsuarioActual(jti);

      enviarRespuestaExitosa(res, {
        datos: resultado.datos,
        mensaje: resultado.mensaje,
      });
    } catch (error) {
      if (error instanceof ErrorAuth) {
        console.warn(`⚠️  Error obteniendo usuario actual: ${error.message}`);

        return enviarRespuestaError(res, error.message, error.statusCode, {
          codigo: error.codigo,
        });
      }

      console.error("❌ Error interno obteniendo usuario actual:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }

  /**
   * ✅ VERIFICAR TOKEN
   *
   * GET /api/auth/verify
   *
   * Verifica si el token actual es válido y retorna información básica
   * Útil para verificar estado de autenticación desde el frontend
   */
  async verificarToken(req: RequestAutenticado, res: Response): Promise<void> {
    try {
      // Si llegamos aquí, el token ya fue validado por el middleware
      const usuario = req.user;

      console.log(
        `✅ Token verificado: Usuario ${usuario.usuario} (JTI: ${usuario.jti})`
      );

      enviarRespuestaExitosa(res, {
        datos: {
          valido: true,
          usuario: {
            id_ct_usuario: usuario.id_ct_usuario,
            uuid_usuario: usuario.uuid_usuario,
            usuario: usuario.usuario,
            email: usuario.email,
          },
          sesion: {
            jti: usuario.jti,
            id_sesion: usuario.id_sesion,
            fecha_expiracion: usuario.fecha_expiracion,
            ip_origen: usuario.ip_origen,
          },
          tiempoRestante: Math.max(
            0,
            usuario.fecha_expiracion.getTime() - Date.now()
          ),
        },
        mensaje: "Token válido",
      });
    } catch (error) {
      console.error("❌ Error interno en verificación de token:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }

  /**
   * 📊 OBTENER SESIONES ACTIVAS
   *
   * GET /api/auth/sessions
   *
   * Lista todas las sesiones activas del usuario actual
   * Útil para mostrar dispositivos conectados y permitir logout remoto
   */
  async obtenerSesionesActivas(
    req: RequestAutenticado,
    res: Response
  ): Promise<void> {
    try {
      const idUsuario = req.user.id_ct_usuario;

      console.log(
        `📊 Solicitud de sesiones activas: Usuario ${req.user.usuario}`
      );

      // Importar Prisma aquí para evitar dependencias circulares
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      const sesiones = await prisma.ct_sesion.findMany({
        where: {
          id_ct_usuario: idUsuario,
          activa: true,
          fecha_expiracion: {
            gt: new Date(),
          },
        },
        select: {
          id_ct_sesion: true,
          jti: true,
          ip_origen: true,
          user_agent: true,
          dispositivo: true,
          fecha_creacion: true,
          fecha_expiracion: true,
          fecha_ultimo_uso: true,
        },
        orderBy: {
          fecha_ultimo_uso: "desc",
        },
      });

      // Marcar la sesión actual
      const sesionesConMarcado = sesiones.map((sesion) => ({
        ...sesion,
        esActual: sesion.jti === req.user.jti,
      }));

      enviarRespuestaExitosa(res, {
        datos: {
          sesiones: sesionesConMarcado,
          total: sesiones.length,
        },
        mensaje: "Sesiones activas obtenidas exitosamente",
      });

      await prisma.$disconnect();
    } catch (error) {
      console.error("❌ Error obteniendo sesiones activas:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }

  /**
   * 🗑️ CERRAR SESIÓN ESPECÍFICA
   *
   * DELETE /api/auth/sessions/:sessionId
   *
   * Cierra una sesión específica por su ID
   * Útil para "logout remoto" desde panel de sesiones activas
   */
  async cerrarSesionEspecifica(
    req: RequestAutenticado,
    res: Response
  ): Promise<void> {
    try {
      const sessionId = req.params.sessionId;
      const idUsuario = req.user.id_ct_usuario;

      console.log(
        `🗑️ Cerrando sesión específica: ${sessionId} para usuario ${req.user.usuario}`
      );

      // Importar Prisma aquí para evitar dependencias circulares
      const { PrismaClient } = await import("@prisma/client");
      const prisma = new PrismaClient();

      // Verificar que la sesión pertenece al usuario actual
      const sesion = await prisma.ct_sesion.findFirst({
        where: {
          id_ct_sesion: sessionId,
          id_ct_usuario: idUsuario,
          activa: true,
        },
      });

      if (!sesion) {
        return enviarRespuestaError(
          res,
          "Sesión no encontrada o ya cerrada",
          404,
          {
            codigo: "SESION_NO_ENCONTRADA",
          }
        );
      }

      // Cerrar la sesión y revocar refresh tokens asociados
      await prisma.$transaction([
        prisma.ct_sesion.update({
          where: { id_ct_sesion: sessionId },
          data: { activa: false },
        }),
        prisma.ct_refresh_token.updateMany({
          where: {
            id_ct_sesion: sessionId,
            revocado: false,
            usado: false,
          },
          data: {
            revocado: true,
            motivo_revocacion: "logout_remoto",
          },
        }),
      ]);

      console.log(`✅ Sesión cerrada exitosamente: ${sessionId}`);

      enviarRespuestaExitosa(res, {
        datos: {
          sesionCerrada: sessionId,
          eraActual: sesion.jti === req.user.jti,
        },
        mensaje: "Sesión cerrada exitosamente",
      });

      await prisma.$disconnect();
    } catch (error) {
      console.error("❌ Error cerrando sesión específica:", error);

      enviarRespuestaError(res, "Error interno del servidor", 500, {
        codigo: "ERROR_INTERNO",
      });
    }
  }
}

// Exportar instancia única del controlador
export default new AuthController();

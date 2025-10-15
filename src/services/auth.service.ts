/**
 * @fileoverview Servicio de Autenticación Moderno con JWT + UUID
 *
 * Este servicio implementa un sistema de autenticación completo con:
 * ✅ JWT con JTI (UUID) para tracking único de tokens
 * ✅ Refresh tokens seguros con rotación
 * ✅ Gestión de sesiones activas en base de datos
 * ✅ Bloqueo de cuentas por intentos fallidos
 * ✅ Integración con BaseService para consistencia
 * ✅ Auditoría completa de actividad de usuarios
 *
 * 🔐 FLUJO DE AUTENTICACIÓN:
 * 1. Usuario envía credenciales
 * 2. Validar usuario y contraseña (bcrypt)
 * 3. Generar JWT con JTI único (UUID)
 * 4. Crear sesión en BD con información del dispositivo
 * 5. Generar refresh token asociado a la sesión
 * 6. Retornar tokens al cliente
 *
 * 🔄 FLUJO DE REFRESH:
 * 1. Cliente envía refresh token
 * 2. Validar refresh token en BD
 * 3. Generar nuevo JWT con nuevo JTI
 * 4. Actualizar sesión existente
 * 5. Generar nuevo refresh token (rotación)
 * 6. Invalidar refresh token anterior
 */

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { BaseService } from "./BaseService";
import { jwtConfig, bcryptConfig } from "../config/env";
import {
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
  RespuestaLogin,
  RespuestaRefresh,
  RespuestaLogout,
  UsuarioActual,
} from "../schemas/auth.schemas";

const prisma = new PrismaClient();

// ===== INTERFACES =====

/**
 * Payload del JWT con información esencial y JTI único
 */
interface PayloadJwt {
  sub: number; // ID del usuario (subject estándar JWT)
  uuid: string; // UUID del usuario para identificación alternativa
  usuario: string; // Nombre de usuario (no sensible)
  jti: string; // JWT ID único (UUID) para tracking
  iat: number; // Issued at (timestamp)
  exp: number; // Expiration (timestamp)
  iss: string; // Issuer (emisor)
}

/**
 * Información del dispositivo/cliente para auditoría
 */
interface InfoDispositivo {
  ip: string;
  userAgent?: string;
  dispositivo?: string;
}

/**
 * Resultado interno de validación de credenciales
 */
interface ValidacionCredenciales {
  valido: boolean;
  usuario?: any;
  motivo?: string;
  intentosFallidos?: number;
  bloqueadoHasta?: Date;
}

// ===== ERRORES PERSONALIZADOS =====

export class ErrorAuth extends Error {
  constructor(
    message: string,
    public codigo: string = "AUTH_ERROR",
    public statusCode: number = 401
  ) {
    super(message);
    this.name = "ErrorAuth";
  }
}

// ===== SERVICIO PRINCIPAL =====

export class AuthService {
  /**
   * 🔐 LOGIN DE USUARIO
   *
   * Proceso completo de autenticación que incluye:
   * - Validación de credenciales
   * - Control de intentos fallidos
   * - Generación de tokens seguros
   * - Creación de sesión activa
   * - Auditoría de acceso
   */
  static async login(
    credenciales: LoginInput,
    infoDispositivo: InfoDispositivo
  ): Promise<RespuestaLogin> {
    try {
      // 1. 🔍 VALIDAR CREDENCIALES Y ESTADO DE CUENTA
      const validacion = await this.validarCredenciales(credenciales);

      if (!validacion.valido) {
        // Registrar intento fallido
        await this.registrarIntentoFallido(
          credenciales.usuario,
          infoDispositivo
        );

        throw new ErrorAuth(
          validacion.motivo || "Credenciales inválidas",
          "CREDENCIALES_INVALIDAS",
          401
        );
      }

      const usuario = validacion.usuario;

      // 2. 🆔 GENERAR JWT ID ÚNICO
      const jti = uuidv4(); // JWT ID único

      // 3. 🎫 GENERAR JWT CON JTI
      const payload: PayloadJwt = {
        sub: usuario.id_ct_usuario,
        uuid: usuario.uuid_usuario,
        usuario: usuario.usuario,
        jti,
        iat: Math.floor(Date.now() / 1000),
        exp:
          Math.floor(Date.now() / 1000) +
          this.parseTimeToSeconds(jwtConfig.expiresIn),
        iss: "infraestructura-system",
      };

      const accessToken = jwt.sign(payload, jwtConfig.secret, {
        algorithm: "HS256",
      });

      // 4. 🗄️ CREAR SESIÓN EN BASE DE DATOS
      const fechaExpiracion = new Date(payload.exp * 1000);

      const sesion = await prisma.ct_sesion.create({
        data: {
          id_ct_usuario: usuario.id_ct_usuario,
          jti,
          ip_origen: infoDispositivo.ip,
          user_agent: infoDispositivo.userAgent,
          dispositivo: infoDispositivo.dispositivo || null,
          fecha_expiracion: fechaExpiracion,
          activa: true,
        },
      });

      // 5. 🔄 GENERAR REFRESH TOKEN
      // Convertir id_ct_sesion (INT) a string para el refresh token
      const refreshToken = await this.generarRefreshToken(
        usuario.id_ct_usuario,
        sesion.id_ct_sesion.toString()
      );

      // 6. ✅ ACTUALIZAR ESTADÍSTICAS DE USUARIO
      await prisma.ct_usuario.update({
        where: { id_ct_usuario: usuario.id_ct_usuario },
        data: {
          ultimo_login: new Date(),
          intentos_fallidos: 0, // Resetear intentos fallidos
          bloqueado_hasta: null, // Desbloquear cuenta si estaba bloqueada
        },
      });

      // 7. 📊 PREPARAR RESPUESTA
      const respuesta: RespuestaLogin = {
        exito: true,
        mensaje: "Inicio de sesión exitoso",
        datos: {
          usuario: {
            id_ct_usuario: usuario.id_ct_usuario,
            uuid_usuario: usuario.uuid_usuario,
            usuario: usuario.usuario,
            email: usuario.email,
            ultimo_login: new Date(),
            fecha_registro: usuario.fecha_registro,
          },
          tokens: {
            accessToken,
            refreshToken: refreshToken.id_ct_refresh_token,
            tipoToken: "Bearer",
            expiraEn: this.parseTimeToSeconds(jwtConfig.expiresIn),
          },
          sesion: {
            id_sesion: sesion.id_ct_sesion.toString(),
            jti,
            fecha_expiracion: fechaExpiracion,
            ip_origen: infoDispositivo.ip,
            dispositivo: infoDispositivo.dispositivo || null,
          },
        },
        meta: {
          tiempoRespuesta: Date.now(),
          version: "2.0.0",
        },
      };

      return respuesta;
    } catch (error) {
      if (error instanceof ErrorAuth) {
        throw error;
      }

      console.error("❌ Error en login:", error);
      throw new ErrorAuth(
        "Error interno durante la autenticación",
        "ERROR_INTERNO",
        500
      );
    }
  }

  /**
   * 🔄 REFRESH TOKEN
   *
   * Renueva el access token usando un refresh token válido
   * Implementa rotación de refresh tokens para mayor seguridad
   */
  static async refreshToken(
    input: RefreshTokenInput
  ): Promise<RespuestaRefresh> {
    try {
      // 1. 🔍 VALIDAR REFRESH TOKEN
      const refreshTokenRecord = await prisma.ct_refresh_token.findUnique({
        where: { id_ct_refresh_token: input.refreshToken },
        include: {
          ct_usuario: {
            select: {
              id_ct_usuario: true,
              uuid_usuario: true,
              usuario: true,
              email: true,
              estado: true,
            },
          },
        },
      });

      if (!refreshTokenRecord) {
        throw new ErrorAuth(
          "Refresh token inválido",
          "REFRESH_TOKEN_INVALIDO",
          401
        );
      }

      // 2. ✅ VERIFICAR ESTADO DEL REFRESH TOKEN
      const ahora = new Date();

      if (refreshTokenRecord.usado) {
        throw new ErrorAuth(
          "Refresh token ya utilizado",
          "REFRESH_TOKEN_USADO",
          401
        );
      }

      if (refreshTokenRecord.revocado) {
        throw new ErrorAuth(
          "Refresh token revocado",
          "REFRESH_TOKEN_REVOCADO",
          401
        );
      }

      if (refreshTokenRecord.fecha_expiracion < ahora) {
        throw new ErrorAuth(
          "Refresh token expirado",
          "REFRESH_TOKEN_EXPIRADO",
          401
        );
      }

      if (!refreshTokenRecord.ct_usuario.estado) {
        throw new ErrorAuth("Usuario inactivo", "USUARIO_INACTIVO", 401);
      }

      // 3. 🆔 GENERAR NUEVO JTI Y TOKENS
      const nuevoJti = uuidv4();
      const usuario = refreshTokenRecord.ct_usuario;

      const payload: PayloadJwt = {
        sub: usuario.id_ct_usuario,
        uuid: usuario.uuid_usuario,
        usuario: usuario.usuario,
        jti: nuevoJti,
        iat: Math.floor(Date.now() / 1000),
        exp:
          Math.floor(Date.now() / 1000) +
          this.parseTimeToSeconds(jwtConfig.expiresIn),
        iss: "infraestructura-system",
      };

      const nuevoAccessToken = jwt.sign(payload, jwtConfig.secret, {
        algorithm: "HS256",
      });

      // 4. 🔄 ROTACIÓN DE REFRESH TOKEN (crear nuevo, invalidar anterior)
      const [nuevoRefreshToken] = await prisma.$transaction([
        // Crear nuevo refresh token
        prisma.ct_refresh_token.create({
          data: {
            id_ct_refresh_token: uuidv4(),
            id_ct_usuario: usuario.id_ct_usuario,
            token_hash: await bcrypt.hash(input.refreshToken, 10), // Hash por seguridad
            id_ct_sesion: refreshTokenRecord.id_ct_sesion,
            fecha_expiracion: new Date(
              Date.now() +
                this.parseTimeToSeconds(jwtConfig.refreshExpiresIn) * 1000
            ),
          },
        }),
        // Marcar el anterior como usado
        prisma.ct_refresh_token.update({
          where: { id_ct_refresh_token: input.refreshToken },
          data: {
            usado: true,
            fecha_uso: new Date(),
          },
        }),
        // Actualizar sesión con nuevo JTI (convertir string a number)
        prisma.ct_sesion.update({
          where: { 
            id_ct_sesion: refreshTokenRecord.id_ct_sesion 
              ? parseInt(refreshTokenRecord.id_ct_sesion) 
              : 0 
          },
          data: {
            jti: nuevoJti,
            fecha_ultimo_uso: new Date(),
            fecha_expiracion: new Date(payload.exp * 1000),
          },
        }),
      ]);

      // 5. 📊 PREPARAR RESPUESTA
      const respuesta: RespuestaRefresh = {
        exito: true,
        mensaje: "Token renovado exitosamente",
        datos: {
          accessToken: nuevoAccessToken,
          refreshToken: nuevoRefreshToken.id_ct_refresh_token,
          tipoToken: "Bearer",
          expiraEn: this.parseTimeToSeconds(jwtConfig.expiresIn),
          jti: nuevoJti,
        },
      };

      return respuesta;
    } catch (error) {
      if (error instanceof ErrorAuth) {
        throw error;
      }

      console.error("❌ Error en refresh token:", error);
      throw new ErrorAuth(
        "Error interno durante la renovación del token",
        "ERROR_INTERNO",
        500
      );
    }
  }

  /**
   * 🚪 LOGOUT DE USUARIO
   *
   * Termina sesión(es) activa(s) y revoca refresh tokens
   * Puede cerrar una sesión específica o todas las sesiones del usuario
   */
  static async logout(
    input: LogoutInput,
    jtiActual: string
  ): Promise<RespuestaLogout> {
    try {
      // 1. 🔍 OBTENER INFORMACIÓN DE LA SESIÓN ACTUAL
      const sesionActual = await prisma.ct_sesion.findUnique({
        where: { jti: jtiActual },
        include: { ct_usuario: true },
      });

      if (!sesionActual) {
        throw new ErrorAuth("Sesión no encontrada", "SESION_INVALIDA", 401);
      }

      let sesionesTerminadas = 0;
      let tokensRevocados = 0;

      if (input.cerrarTodasLasSesiones) {
        // 2A. 🔥 LOGOUT GLOBAL - Cerrar todas las sesiones del usuario
        const [sesionesResult, tokensResult] = await prisma.$transaction([
          prisma.ct_sesion.updateMany({
            where: {
              id_ct_usuario: sesionActual.id_ct_usuario,
              activa: true,
            },
            data: { activa: false },
          }),
          prisma.ct_refresh_token.updateMany({
            where: {
              id_ct_usuario: sesionActual.id_ct_usuario,
              revocado: false,
              usado: false,
            },
            data: {
              revocado: true,
              motivo_revocacion: "logout_global",
            },
          }),
        ]);

        sesionesTerminadas = sesionesResult.count;
        tokensRevocados = tokensResult.count;
      } else {
        // 2B. 🎯 LOGOUT ESPECÍFICO - Solo la sesión actual
        const sesionId = input.sesionId || sesionActual.id_ct_sesion.toString();

        const [sesionesResult, tokensResult] = await prisma.$transaction([
          prisma.ct_sesion.updateMany({
            where: {
              id_ct_sesion: parseInt(sesionId),
              id_ct_usuario: sesionActual.id_ct_usuario,
              activa: true,
            },
            data: { activa: false },
          }),
          prisma.ct_refresh_token.updateMany({
            where: {
              id_ct_sesion: sesionId,
              revocado: false,
              usado: false,
            },
            data: {
              revocado: true,
              motivo_revocacion: "logout_especifico",
            },
          }),
        ]);

        sesionesTerminadas = sesionesResult.count;
        tokensRevocados = tokensResult.count;
      }

      // 3. 📊 PREPARAR RESPUESTA
      const respuesta: RespuestaLogout = {
        exito: true,
        mensaje: input.cerrarTodasLasSesiones
          ? "Todas las sesiones han sido cerradas"
          : "Sesión cerrada exitosamente",
        datos: {
          sesionesTerminadas,
          tokensRevocados,
        },
      };

      return respuesta;
    } catch (error) {
      if (error instanceof ErrorAuth) {
        throw error;
      }

      console.error("❌ Error en logout:", error);
      throw new ErrorAuth(
        "Error interno durante el logout",
        "ERROR_INTERNO",
        500
      );
    }
  }

  /**
   * 👤 OBTENER USUARIO ACTUAL
   *
   * Retorna información del usuario autenticado y su sesión actual
   */
  static async obtenerUsuarioActual(jti: string): Promise<UsuarioActual> {
    try {
      const sesion = await prisma.ct_sesion.findUnique({
        where: { jti },
        include: {
          ct_usuario: {
            select: {
              id_ct_usuario: true,
              uuid_usuario: true,
              usuario: true,
              email: true,
              estado: true,
              ultimo_login: true,
              fecha_registro: true,
              fecha_modificacion: true,
            },
          },
        },
      });

      if (!sesion || !sesion.activa) {
        throw new ErrorAuth(
          "Sesión inválida o expirada",
          "SESION_INVALIDA",
          401
        );
      }

      // Contar sesiones activas del usuario
      const sesionesActivas = await prisma.ct_sesion.count({
        where: {
          id_ct_usuario: sesion.id_ct_usuario,
          activa: true,
        },
      });

      const respuesta: UsuarioActual = {
        exito: true,
        mensaje: "Usuario obtenido exitosamente",
        datos: {
          usuario: sesion.ct_usuario,
          sesionActual: {
            id_sesion: sesion.id_ct_sesion.toString(),
            jti: sesion.jti,
            fecha_creacion: sesion.fecha_creacion,
            fecha_expiracion: sesion.fecha_expiracion,
            fecha_ultimo_uso: sesion.fecha_ultimo_uso,
            ip_origen: sesion.ip_origen,
            dispositivo: sesion.dispositivo,
          },
          estadisticasSesiones: {
            sesionesActivas,
            ultimaActividad: sesion.fecha_ultimo_uso,
          },
        },
      };

      return respuesta;
    } catch (error) {
      if (error instanceof ErrorAuth) {
        throw error;
      }

      console.error("❌ Error obteniendo usuario actual:", error);
      throw new ErrorAuth(
        "Error interno obteniendo información del usuario",
        "ERROR_INTERNO",
        500
      );
    }
  }

  // ===== MÉTODOS PRIVADOS =====

  /**
   * 🔍 VALIDAR CREDENCIALES
   *
   * Verifica usuario, contraseña y estado de la cuenta
   */
  private static async validarCredenciales(
    credenciales: LoginInput
  ): Promise<ValidacionCredenciales> {
    try {
      // Buscar usuario por nombre de usuario
      const usuario = await prisma.ct_usuario.findUnique({
        where: { usuario: credenciales.usuario },
      });

      if (!usuario) {
        return { valido: false, motivo: "Usuario no encontrado" };
      }

      // Verificar si la cuenta está bloqueada
      if (usuario.bloqueado_hasta && usuario.bloqueado_hasta > new Date()) {
        return {
          valido: false,
          motivo:
            "Cuenta temporalmente bloqueada por múltiples intentos fallidos",
          bloqueadoHasta: usuario.bloqueado_hasta,
        };
      }

      // Verificar si el usuario está activo
      if (!usuario.estado) {
        return { valido: false, motivo: "Cuenta de usuario inactiva" };
      }

      // Verificar contraseña
      const contrasenaValida = await bcrypt.compare(
        credenciales.contrasena,
        usuario.contrasena
      );

      if (!contrasenaValida) {
        return {
          valido: false,
          motivo: "Contraseña incorrecta",
          usuario,
          intentosFallidos: usuario.intentos_fallidos,
        };
      }

      return { valido: true, usuario };
    } catch (error) {
      console.error("❌ Error validando credenciales:", error);
      return { valido: false, motivo: "Error interno de validación" };
    }
  }

  /**
   * 📊 REGISTRAR INTENTO FALLIDO
   *
   * Incrementa contador de intentos fallidos y bloquea cuenta si es necesario
   */
  private static async registrarIntentoFallido(
    nombreUsuario: string,
    infoDispositivo: InfoDispositivo
  ): Promise<void> {
    try {
      const usuario = await prisma.ct_usuario.findUnique({
        where: { usuario: nombreUsuario },
      });

      if (!usuario) return; // No incrementar si el usuario no existe

      const nuevosIntentos = usuario.intentos_fallidos + 1;
      const LIMITE_INTENTOS = 5;
      const TIEMPO_BLOQUEO_MINUTOS = 30;

      let bloqueadoHasta: Date | null = null;

      if (nuevosIntentos >= LIMITE_INTENTOS) {
        bloqueadoHasta = new Date(
          Date.now() + TIEMPO_BLOQUEO_MINUTOS * 60 * 1000
        );
      }

      await prisma.ct_usuario.update({
        where: { id_ct_usuario: usuario.id_ct_usuario },
        data: {
          intentos_fallidos: nuevosIntentos,
          bloqueado_hasta: bloqueadoHasta,
        },
      });

      console.log(
        `⚠️  Intento fallido registrado para usuario ${nombreUsuario} (${nuevosIntentos}/${LIMITE_INTENTOS}) desde IP ${infoDispositivo.ip}`
      );
    } catch (error) {
      console.error("❌ Error registrando intento fallido:", error);
    }
  }

  /**
   * 🔄 GENERAR REFRESH TOKEN
   *
   * Crea un nuevo refresh token asociado a una sesión
   * @param idSesion debe ser string porque ct_refresh_token.id_ct_sesion es VARCHAR(36)
   */
  private static async generarRefreshToken(
    idUsuario: number,
    idSesion: string
  ): Promise<any> {
    const refreshToken = await prisma.ct_refresh_token.create({
      data: {
        id_ct_refresh_token: uuidv4(),
        id_ct_usuario: idUsuario,
        token_hash: await bcrypt.hash(uuidv4(), 10), // Hash del UUID por seguridad
        id_ct_sesion: idSesion,
        fecha_expiracion: new Date(
          Date.now() +
            this.parseTimeToSeconds(jwtConfig.refreshExpiresIn) * 1000
        ),
      },
    });

    return refreshToken;
  }

  /**
   * ⏱️ CONVERTIR TIEMPO A SEGUNDOS
   *
   * Convierte strings como "15m", "7d", "1h" a segundos
   */
  private static parseTimeToSeconds(timeStr: string): number {
    const regex = /^(\d+)([smhd])$/;
    const match = timeStr.match(regex);

    if (!match) {
      throw new Error(`Formato de tiempo inválido: ${timeStr}`);
    }

    const [, amount, unit] = match;
    const num = parseInt(amount);

    switch (unit) {
      case "s":
        return num;
      case "m":
        return num * 60;
      case "h":
        return num * 60 * 60;
      case "d":
        return num * 24 * 60 * 60;
      default:
        throw new Error(`Unidad de tiempo no soportada: ${unit}`);
    }
  }
}

export default AuthService;

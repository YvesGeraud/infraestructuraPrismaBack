/**
 * @fileoverview Rate Limiter Avanzado para Autenticación
 *
 * 🛡️ EXPLICACIÓN DE RATE LIMITING:
 *
 * Rate Limiting es como un "semáforo inteligente" que controla cuántas requests
 * puede hacer un usuario/IP en un período de tiempo específico.
 *
 * 🚦 ALGORITMO SLIDING WINDOW:
 * ┌─────────────────────────────────────────────────────────────┐
 * │  [15 min ventana]                                           │
 * │  ├─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐                           │
 * │  │1│2│3│4│5│ │ │ │ │ │ │ │ │ │ │  ← Intentos de login      │
 * │  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘                           │
 * │                    ↑                                        │
 * │              Máximo 5 intentos                              │
 * └─────────────────────────────────────────────────────────────┘
 *
 * 💡 BENEFICIOS:
 * ✅ Previene ataques de fuerza bruta
 * ✅ Protege contra DDoS
 * ✅ Mejora la estabilidad del servidor
 * ✅ Permite diferentes límites por endpoint
 *
 * 🎯 ESTRATEGIA MULTICAPA:
 * 1. Rate limit por IP (ataque distribuido)
 * 2. Rate limit por usuario (ataque dirigido)
 * 3. Bloqueo progresivo (más intentos = más tiempo bloqueado)
 * 4. Whitelist de IPs confiables (opcional)
 */

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { enviarRespuestaError } from "../utils/responseUtils";

const prisma = new PrismaClient();

// ===== TIPOS =====

interface RateLimitConfig {
  /** Ventana de tiempo en minutos */
  ventanaMinutos: number;
  /** Máximo número de intentos en la ventana */
  maxIntentos: number;
  /** Tiempo de bloqueo en minutos después de exceder el límite */
  tiempoBloqueoMinutos: number;
  /** Mensaje personalizado cuando se excede el límite */
  mensaje?: string;
  /** Identificador del endpoint para tracking */
  endpoint: string;
}

interface RateLimitResult {
  permitido: boolean;
  intentosRestantes: number;
  tiempoReinicioMs: number;
  bloqueadoHasta?: Date;
}

// ===== CONFIGURACIONES PREDEFINIDAS =====

const CONFIGURACIONES_RATE_LIMIT: Record<string, RateLimitConfig> = {
  AUTH_LOGIN: {
    ventanaMinutos: 15,
    maxIntentos: 5,
    tiempoBloqueoMinutos: 15,
    mensaje: "Demasiados intentos de login. Intenta de nuevo en 15 minutos",
    endpoint: "auth_login",
  },
  AUTH_REFRESH: {
    ventanaMinutos: 5,
    maxIntentos: 10,
    tiempoBloqueoMinutos: 5,
    mensaje:
      "Demasiados intentos de refresh token. Intenta de nuevo en 5 minutos",
    endpoint: "auth_refresh",
  },
  AUTH_FORGOT_PASSWORD: {
    ventanaMinutos: 60,
    maxIntentos: 3,
    tiempoBloqueoMinutos: 60,
    mensaje:
      "Demasiadas solicitudes de recuperación de contraseña. Intenta de nuevo en 1 hora",
    endpoint: "auth_forgot_password",
  },
};

// ===== CLASE PRINCIPAL DE RATE LIMITING =====

export class AuthRateLimiter {
  /**
   * 🔍 VERIFICAR RATE LIMIT
   *
   * Este método implementa el algoritmo de "ventana deslizante":
   * 1. Busca registros existentes para la IP/endpoint
   * 2. Verifica si está bloqueado
   * 3. Cuenta intentos en la ventana de tiempo
   * 4. Decide si permitir o bloquear la request
   */
  static async verificarRateLimit(
    identificador: string,
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const ahora = new Date();
    const inicioVentana = new Date(
      ahora.getTime() - config.ventanaMinutos * 60 * 1000
    );

    try {
      // 1. 🔍 VERIFICAR SI ESTÁ BLOQUEADO
      const registroExistente = await prisma.ct_rate_limit.findFirst({
        where: {
          identificador,
          endpoint: config.endpoint,
          bloqueado_hasta: {
            gte: ahora, // Si bloqueado_hasta es mayor que ahora, aún está bloqueado
          },
        },
      });

      if (registroExistente?.bloqueado_hasta) {
        return {
          permitido: false,
          intentosRestantes: 0,
          tiempoReinicioMs: registroExistente.bloqueado_hasta.getTime(),
          bloqueadoHasta: registroExistente.bloqueado_hasta,
        };
      }

      // 2. 🔢 CONTAR INTENTOS EN LA VENTANA ACTUAL
      const intentosEnVentana = await prisma.ct_rate_limit.count({
        where: {
          identificador,
          endpoint: config.endpoint,
          ventana_inicio: {
            gte: inicioVentana,
          },
        },
      });

      // 3. ✅ VERIFICAR SI PUEDE CONTINUAR
      if (intentosEnVentana < config.maxIntentos) {
        // ✅ PERMITIDO - Registrar el intento
        await prisma.ct_rate_limit.create({
          data: {
            id_ct_rate_limit: `${identificador}-${
              config.endpoint
            }-${Date.now()}`,
            identificador,
            endpoint: config.endpoint,
            intentos: 1,
            ventana_inicio: ahora,
          },
        });

        return {
          permitido: true,
          intentosRestantes: config.maxIntentos - intentosEnVentana - 1,
          tiempoReinicioMs: ahora.getTime() + config.ventanaMinutos * 60 * 1000,
        };
      }

      // 4. 🚫 LÍMITE EXCEDIDO - Bloquear
      const bloqueadoHasta = new Date(
        ahora.getTime() + config.tiempoBloqueoMinutos * 60 * 1000
      );

      await prisma.ct_rate_limit.create({
        data: {
          id_ct_rate_limit: `${identificador}-${config.endpoint}-${Date.now()}`,
          identificador,
          endpoint: config.endpoint,
          intentos: intentosEnVentana + 1,
          ventana_inicio: ahora,
          bloqueado_hasta: bloqueadoHasta,
        },
      });

      return {
        permitido: false,
        intentosRestantes: 0,
        tiempoReinicioMs: bloqueadoHasta.getTime(),
        bloqueadoHasta,
      };
    } catch (error) {
      console.error("❌ Error en rate limiting:", error);
      // En caso de error, permitir la request para no bloquear el sistema
      return {
        permitido: true,
        intentosRestantes: config.maxIntentos,
        tiempoReinicioMs: ahora.getTime() + config.ventanaMinutos * 60 * 1000,
      };
    }
  }

  /**
   * 🧹 LIMPIAR REGISTROS ANTIGUOS
   *
   * Método de mantenimiento que elimina registros expirados
   * para mantener la tabla optimizada
   */
  static async limpiarRegistrosAntiguos(): Promise<number> {
    const ahora = new Date();
    const hace24Horas = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);

    try {
      const resultado = await prisma.ct_rate_limit.deleteMany({
        where: {
          ventana_inicio: {
            lt: hace24Horas,
          },
          bloqueado_hasta: {
            lt: ahora,
          },
        },
      });

      return resultado.count;
    } catch (error) {
      console.error("❌ Error limpiando registros de rate limit:", error);
      return 0;
    }
  }
}

// ===== MIDDLEWARES ESPECÍFICOS =====

/**
 * 🚦 MIDDLEWARE PARA LOGIN
 *
 * Aplica rate limiting específico para intentos de login
 * Identifica por IP para prevenir ataques de fuerza bruta
 */
export const rateLimitLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const config = CONFIGURACIONES_RATE_LIMIT.AUTH_LOGIN;

  const resultado = await AuthRateLimiter.verificarRateLimit(ip, config);

  // 📊 AGREGAR HEADERS INFORMATIVOS
  res.set({
    "X-RateLimit-Limit": config.maxIntentos.toString(),
    "X-RateLimit-Remaining": resultado.intentosRestantes.toString(),
    "X-RateLimit-Reset": new Date(resultado.tiempoReinicioMs).toISOString(),
    "X-RateLimit-Window": `${config.ventanaMinutos}m`,
  });

  if (!resultado.permitido) {
    const tiempoRestanteMs = resultado.tiempoReinicioMs - Date.now();
    const minutosRestantes = Math.ceil(tiempoRestanteMs / (1000 * 60));

    return enviarRespuestaError(
      res,
      config.mensaje || "Rate limit excedido",
      429,
      {
        codigo: "RATE_LIMIT_EXCEEDED",
        tiempoRestanteMinutos: minutosRestantes,
        bloqueadoHasta: resultado.bloqueadoHasta?.toISOString(),
      }
    );
  }

  next();
};

/**
 * 🔄 MIDDLEWARE PARA REFRESH TOKEN
 */
export const rateLimitRefresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const config = CONFIGURACIONES_RATE_LIMIT.AUTH_REFRESH;

  const resultado = await AuthRateLimiter.verificarRateLimit(ip, config);

  res.set({
    "X-RateLimit-Limit": config.maxIntentos.toString(),
    "X-RateLimit-Remaining": resultado.intentosRestantes.toString(),
    "X-RateLimit-Reset": new Date(resultado.tiempoReinicioMs).toISOString(),
  });

  if (!resultado.permitido) {
    const tiempoRestanteMs = resultado.tiempoReinicioMs - Date.now();
    const minutosRestantes = Math.ceil(tiempoRestanteMs / (1000 * 60));

    return enviarRespuestaError(
      res,
      config.mensaje || "Rate limit excedido",
      429,
      {
        codigo: "RATE_LIMIT_EXCEEDED",
        tiempoRestanteMinutos: minutosRestantes,
      }
    );
  }

  next();
};

/**
 * 🔐 MIDDLEWARE PERSONALIZABLE
 *
 * Permite crear rate limiters personalizados para diferentes endpoints
 */
export const crearRateLimiter = (
  configKey: keyof typeof CONFIGURACIONES_RATE_LIMIT
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown";
    const config = CONFIGURACIONES_RATE_LIMIT[configKey];

    const resultado = await AuthRateLimiter.verificarRateLimit(ip, config);

    res.set({
      "X-RateLimit-Limit": config.maxIntentos.toString(),
      "X-RateLimit-Remaining": resultado.intentosRestantes.toString(),
      "X-RateLimit-Reset": new Date(resultado.tiempoReinicioMs).toISOString(),
    });

    if (!resultado.permitido) {
      const tiempoRestanteMs = resultado.tiempoReinicioMs - Date.now();
      const minutosRestantes = Math.ceil(tiempoRestanteMs / (1000 * 60));

      return enviarRespuestaError(
        res,
        config.mensaje || "Rate limit excedido",
        429,
        {
          codigo: "RATE_LIMIT_EXCEEDED",
          tiempoRestanteMinutos: minutosRestantes,
        }
      );
    }

    next();
  };
};

// ===== TAREA DE MANTENIMIENTO =====

/**
 * 🕐 INICIALIZAR LIMPIEZA AUTOMÁTICA
 *
 * Ejecuta limpieza de registros antiguos cada 6 horas
 */
export const inicializarLimpiezaRateLimit = () => {
  const INTERVALO_LIMPIEZA = 6 * 60 * 60 * 1000; // 6 horas

  setInterval(async () => {
    try {
      const eliminados = await AuthRateLimiter.limpiarRegistrosAntiguos();
      if (eliminados > 0) {
        console.log(
          `🧹 Rate Limit: Limpiados ${eliminados} registros antiguos`
        );
      }
    } catch (error) {
      console.error("❌ Error en limpieza automática de rate limit:", error);
    }
  }, INTERVALO_LIMPIEZA);

  console.log("✅ Limpieza automática de rate limit inicializada (cada 6h)");
};

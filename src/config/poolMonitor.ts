import { PrismaClient } from "@prisma/client";
import logger from "./logger";

// Métricas del pool de conexiones
export interface PoolMetrics {
  activeConnections: number;
  idleConnections: number;
  totalConnections: number;
  waitingRequests: number;
  lastUpdate: Date;
}

// Configuraciones específicas del pool por entorno
export const getPoolConfig = () => {
  const { isProduction, isDevelopment, isTest } = require("./env");

  if (isProduction) {
    return {
      connectionLimit: 32, // Máximo 20 conexiones simultáneas
      poolTimeout: 20, // 20 segundos timeout
      connectTimeout: 60, // 60 segundos para conectar
      acquireTimeout: 20000, // 20 segundos para obtener conexión
      createRetryIntervalMillis: 100,
      createTimeoutMillis: 20000,
    };
  }

  if (isDevelopment) {
    return {
      connectionLimit: 10, // Solo 5 conexiones en desarrollo
      poolTimeout: 30, // Más tiempo en desarrollo
      connectTimeout: 60,
      acquireTimeout: 30000, // 30 segundos en desarrollo
      createRetryIntervalMillis: 200,
      createTimeoutMillis: 30000,
    };
  }

  if (isTest) {
    return {
      connectionLimit: 2, // Mínimo para tests
      poolTimeout: 10,
      connectTimeout: 30,
      acquireTimeout: 10000,
      createRetryIntervalMillis: 50,
      createTimeoutMillis: 10000,
    };
  }

  // Default
  return {
    connectionLimit: 10,
    poolTimeout: 20,
    connectTimeout: 60,
    acquireTimeout: 20000,
    createRetryIntervalMillis: 100,
    createTimeoutMillis: 20000,
  };
};

// Construir URL de base de datos con configuración del pool
export const buildDatabaseUrl = (baseUrl: string): string => {
  const config = getPoolConfig();

  // Extraer partes de la URL
  const url = new URL(baseUrl);

  // Agregar parámetros del pool
  url.searchParams.set("connection_limit", config.connectionLimit.toString());
  url.searchParams.set("pool_timeout", config.poolTimeout.toString());
  url.searchParams.set("connect_timeout", config.connectTimeout.toString());

  // Parámetros específicos de MySQL/MariaDB
  if (url.protocol === "mysql:") {
    url.searchParams.set("sslmode", "prefer");
    url.searchParams.set("charset", "utf8mb4");
  }

  return url.toString();
};

// Clase para monitorear el pool de conexiones
export class PoolMonitor {
  private prisma: PrismaClient;
  private metrics: PoolMetrics = {
    activeConnections: 0,
    idleConnections: 0,
    totalConnections: 0,
    waitingRequests: 0,
    lastUpdate: new Date(),
  };

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  // Obtener métricas actuales del pool
  async getMetrics(): Promise<PoolMetrics> {
    try {
      // Nota: Prisma no expone métricas directas del pool,
      // pero podemos hacer queries para verificar el estado
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1 as health_check`;
      const responseTime = Date.now() - start;

      // Estimar el estado basado en el tiempo de respuesta
      this.metrics = {
        activeConnections:
          responseTime < 50 ? 1 : Math.min(responseTime / 100, 5),
        idleConnections:
          getPoolConfig().connectionLimit -
          (responseTime < 50 ? 1 : Math.min(responseTime / 100, 5)),
        totalConnections: getPoolConfig().connectionLimit,
        waitingRequests: responseTime > 1000 ? 1 : 0,
        lastUpdate: new Date(),
      };

      return this.metrics;
    } catch (error) {
      logger.error("Error obteniendo métricas del pool:", error);
      throw error;
    }
  }

  // Verificar la salud del pool
  async healthCheck(): Promise<{
    healthy: boolean;
    responseTime: number;
    poolSize: number;
    timestamp: Date;
  }> {
    const start = Date.now();

    try {
      await this.prisma.$queryRaw`SELECT 1 as health`;
      const responseTime = Date.now() - start;

      return {
        healthy: responseTime < 5000, // Saludable si responde en menos de 5s
        responseTime,
        poolSize: getPoolConfig().connectionLimit,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error("Health check del pool falló:", error);
      return {
        healthy: false,
        responseTime: Date.now() - start,
        poolSize: getPoolConfig().connectionLimit,
        timestamp: new Date(),
      };
    }
  }

  // Estadísticas detalladas del pool
  async getDetailedStats(): Promise<{
    config: ReturnType<typeof getPoolConfig>;
    metrics: PoolMetrics;
    health: {
      healthy: boolean;
      responseTime: number;
      poolSize: number;
      timestamp: Date;
    };
    recommendations: string[];
  }> {
    const config = getPoolConfig();
    const metrics = await this.getMetrics();
    const health = await this.healthCheck();

    const recommendations: string[] = [];

    // Generar recomendaciones basadas en métricas
    if (health.responseTime > 1000) {
      recommendations.push(
        "Tiempo de respuesta alto - considera aumentar el pool"
      );
    }

    if (metrics.waitingRequests > 0) {
      recommendations.push("Hay solicitudes en espera - pool insuficiente");
    }

    if (health.responseTime < 10 && process.env.NODE_ENV === "production") {
      recommendations.push("Rendimiento excelente - configuración óptima");
    }

    return {
      config,
      metrics,
      health,
      recommendations,
    };
  }

  // Iniciar monitoreo continuo (opcional)
  startMonitoring(intervalMs: number = 30000): NodeJS.Timer {
    return setInterval(async () => {
      try {
        const stats = await this.getDetailedStats();

        if (!stats.health.healthy) {
          logger.warn("Pool de conexiones no saludable:", stats);
        }

        // Log de métricas cada 5 minutos en producción
        if (
          process.env.NODE_ENV === "production" &&
          new Date().getMinutes() % 5 === 0
        ) {
          logger.info("Métricas del pool:", stats);
        }
      } catch (error) {
        logger.error("Error en monitoreo del pool:", error);
      }
    }, intervalMs);
  }
}

// Función helper para crear URL optimizada
export const createOptimizedDatabaseUrl = (): string => {
  // Importar la función helper de env.ts
  const { getDatabaseUrl } = require("./env");
  const baseUrl = getDatabaseUrl();

  return buildDatabaseUrl(baseUrl);
};

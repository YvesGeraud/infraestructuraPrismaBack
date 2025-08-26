import { PrismaClient } from "@prisma/client";
import { createOptimizedDatabaseUrl, PoolMonitor } from "./poolMonitor";
import { isProduction, isDevelopment } from "./env";

// Declaramos globalmente el tipo para evitar conflictos en desarrollo
declare global {
  var __global_prisma__: PrismaClient | undefined;
}

// Configuración del cliente Prisma con pool de conexiones optimizado
const createPrismaClient = () => {
  return new PrismaClient({
    log: isDevelopment ? ["query", "info", "warn", "error"] : ["warn", "error"],

    // 🔥 CONFIGURACIÓN DEL POOL DE CONEXIONES
    datasources: {
      db: {
        url: createOptimizedDatabaseUrl(),
      },
    },

    // Configuración de transacciones optimizada por entorno
    transactionOptions: {
      maxWait: isProduction ? 5000 : 10000, // Prod: 5s, Dev: 10s
      timeout: isProduction ? 10000 : 20000, // Prod: 10s, Dev: 20s
      isolationLevel: "ReadCommitted", // Nivel de aislamiento optimizado
    },
  });
};

// Singleton pattern para evitar múltiples instancias en desarrollo
let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = createPrismaClient();
} else {
  // En desarrollo, usar variable global para persistir entre hot reloads
  if (!global.__global_prisma__) {
    global.__global_prisma__ = createPrismaClient();
  }
  prisma = global.__global_prisma__;
}

// Función para inicializar la conexión
export const initializeDatabase = async (): Promise<void> => {
  try {
    // Log detallado de la configuración de conexión
    const { dbConfig, serverConfig, getDatabaseUrl } = await import("./env");

    console.log("🔌 ===== INICIANDO CONEXIÓN A BASE DE DATOS =====");
    console.log("📊 Configuración de conexión:");
    console.log(`   • Entorno: ${serverConfig.nodeEnv}`);
    console.log(`   • Host: ${dbConfig.host}`);
    console.log(`   • Puerto: ${dbConfig.port}`);
    console.log(`   • Base de datos: ${dbConfig.name}`);
    console.log(`   • Usuario: ${dbConfig.user}`);
    console.log(
      `   • Password: ${
        dbConfig.password ? "***configurado***" : "sin password"
      }`
    );

    // Mostrar la URL construida (sin la password)
    const fullUrl = getDatabaseUrl();
    const urlParseada = new URL(fullUrl);
    const urlSinPassword = `${urlParseada.protocol}//${urlParseada.username}@${urlParseada.host}${urlParseada.pathname}${urlParseada.search}`;
    console.log(`   • URL final: ${urlSinPassword}`);

    console.log("🔄 Intentando conectar con Prisma...");
    const startTime = Date.now();

    await prisma.$connect();

    const connectionTime = Date.now() - startTime;
    console.log("✅ ===== CONEXIÓN EXITOSA =====");
    console.log(`   • Tiempo de conexión: ${connectionTime}ms`);
    console.log(`   • Cliente Prisma: Conectado y listo`);
    console.log(`   • Timestamp: ${new Date().toISOString()}`);
    console.log("=====================================");
  } catch (error) {
    console.log("❌ ===== FALLO EN LA CONEXIÓN =====");
    console.error("💥 Error al conectar con la base de datos:");
    console.error("   • Detalles del error:", error);
    console.error("   • Timestamp del error:", new Date().toISOString());
    console.log("=====================================");
    throw error;
  }
};

// Función para desconectar
export const disconnectDatabase = async (): Promise<void> => {
  try {
    await prisma.$disconnect();
    console.log("✅ Desconexión de la base de datos completada.");
  } catch (error) {
    console.error("❌ Error al desconectar de la base de datos:", error);
  }
};

// Función para verificar estado de la conexión
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("❌ Database health check failed:", error);
    return false;
  }
};

// Monitor del pool de conexiones
export const poolMonitor = new PoolMonitor(prisma);

// Función para obtener estadísticas del pool
export const getPoolStats = () => poolMonitor.getDetailedStats();

// Función para verificar la salud del pool
export const getPoolHealth = () => poolMonitor.healthCheck();

export { prisma };
export default prisma;

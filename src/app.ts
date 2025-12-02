import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import path from "path";

// Configuración de variables de entorno con expansión (permite ${VARIABLE})
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Importaciones de configuración
import {
  prisma,
  initializeDatabase,
  disconnectDatabase,
  poolMonitor,
} from "./config/database";
import { env, serverConfig } from "./config/env";
import apiRoutes from "./routes";
import { SesionCleanupService } from "./services/sesion-cleanup.service";

// Crear aplicación Express
const app = express();

// Middleware de seguridad
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Importar configuración CORS
import { corsConfig } from "./config/env";

console.log(`🌐 CORS configurado para: ${corsConfig.origins.join(", ")}`);

app.use(
  cors({
    origin: corsConfig.origins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: corsConfig.allowedHeaders,
    exposedHeaders: corsConfig.exposedHeaders,
    optionsSuccessStatus: 200, // Para navegadores legacy
    maxAge: 86400, // Cache preflight por 24 horas
  })
);

// Middleware de compresión
app.use(compression());

// Middleware de logging
import { isDevelopment } from "./config/env";

if (isDevelopment) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// 🛡️ MIDDLEWARE CRÍTICO: Detectar multipart/form-data ANTES de parsear
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";

  console.log(`📨 [${req.method}] ${req.url}`);
  console.log(`   Content-Type: ${contentType}`);

  // Si es multipart/form-data, marcar la request y continuar SIN parsear
  if (contentType.includes("multipart/form-data")) {
    console.log(`   ✅ Detectado multipart/form-data - SALTANDO parsers JSON`);
    (req as any).isMultipart = true;
    return next();
  }

  console.log(`   📝 Aplicando parsers JSON/urlencoded`);
  // Para otros tipos, aplicar los parsers
  next();
});

// Middleware para parsear JSON (solo si NO es multipart)
app.use((req, res, next) => {
  if ((req as any).isMultipart) {
    console.log(`   ⏭️  Saltando express.json() - isMultipart=true`);
    return next();
  }
  console.log(`   📝 Aplicando express.json()`);
  express.json({ limit: "10mb" })(req, res, next);
});

// Middleware para parsear urlencoded (solo si NO es multipart)
app.use((req, res, next) => {
  if ((req as any).isMultipart) {
    console.log(`   ⏭️  Saltando express.urlencoded() - isMultipart=true`);
    return next();
  }
  console.log(`   📝 Aplicando express.urlencoded()`);
  express.urlencoded({ extended: true, limit: "10mb" })(req, res, next);
});

// 🛡️ MIDDLEWARE DE RESPALDO: Parsear JSON si viene sin Content-Type
app.use((req, res, next) => {
  // ✅ NO procesar si es multipart/form-data (para archivos)
  if ((req as any).isMultipart) {
    return next();
  }

  if (
    req.method !== "GET" &&
    req.method !== "DELETE" &&
    Object.keys(req.body).length === 0 &&
    req.headers["content-length"] &&
    parseInt(req.headers["content-length"]) > 0
  ) {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => {
      try {
        req.body = JSON.parse(data);
        console.log(
          "⚠️  Body parseado sin Content-Type (agrega Content-Type: application/json):",
          req.body
        );
      } catch (e) {
        console.error("❌ No se pudo parsear body como JSON:", data);
      }
      next();
    });
  } else {
    next();
  }
});

// Servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Servir archivos estáticos
app.use(
  `${serverConfig.host}uploads`,
  express.static(path.join(__dirname, "../uploads"))
);

// Rutas básicas
app.get(`${serverConfig.host}`, (req, res) => {
  res.json({
    message: "🛒 API de Cedex funcionando correctamente",
    version: "1.0.0",
    environment: serverConfig.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Ruta de health check
app.get(`${serverConfig.host}health`, async (req, res) => {
  try {
    const { checkDatabaseHealth } = await import("./config/database");
    const isDatabaseHealthy = await checkDatabaseHealth();

    res.json({
      status: "OK",
      database: isDatabaseHealthy ? "Connected" : "Disconnected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "ERROR",
      database: "Failed",
      timestamp: new Date().toISOString(),
    });
  }
});

// Rutas de la API

// 🔐 MIDDLEWARE GLOBAL DE AUTENTICACIÓN JWT
// Protege TODAS las rutas excepto las públicas (login, registro, health)
import { verificarAutenticacion } from "./middleware/authMiddleware";

// Rutas públicas (sin autenticación)
const rutasPublicas = [
  `${serverConfig.host}api/auth/login`,
  `${serverConfig.host}api/auth/registro`,
  `${serverConfig.host}api/auth/refresh`,
  `${serverConfig.host}health`,
];

// Aplicar autenticación solo a rutas que NO sean públicas
app.use((req, res, next) => {
  // Permitir rutas públicas
  if (rutasPublicas.some((ruta) => req.path.startsWith(ruta))) {
    return next();
  }

  // Permitir GET sin autenticación (para consultas públicas)
  // Comenta esta línea si quieres que los GET también requieran JWT
  /*if (req.method === "GET") {
    return next();
  }*/

  // Para POST, PUT, DELETE, PATCH: Requiere JWT
  verificarAutenticacion(req, res, next);
});

app.use(`${serverConfig.host}api`, apiRoutes);

// Ruta de prueba para verificar Prisma
/*app.get(`${serverConfig.host}api/test`, async (req, res) => {
  try {
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();

    res.json({
      message: "Prisma funcionando correctamente",
      users: userCount,
      products: productCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Error al conectar con la base de datos",
      message: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});*/

// Middleware de manejo de errores
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Algo salió mal!",
      message: isDevelopment ? err.message : "Error interno del servidor",
    });
  }
);

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    path: req.originalUrl,
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Importar configuraciones para logs
    const {
      dbConfig,
      serverConfig,
      jwtConfig,
      corsConfig,
      poolConfig,
      isProduction,
      isDevelopment,
    } = await import("./config/env");

    console.log("🚀 ===== INICIANDO SERVIDOR CEDEX =====");
    console.log(`📊 Configuración del servidor:`);
    console.log(`   • Entorno: ${serverConfig.nodeEnv}`);
    console.log(`   • Puerto: ${serverConfig.port}`);
    console.log(`   • API URL: ${serverConfig.apiUrl || "No configurada"}`);
    console.log(`   • Desarrollo: ${isDevelopment ? "SÍ" : "NO"}`);
    console.log(`   • Producción: ${isProduction ? "SÍ" : "NO"}`);

    console.log(`🔐 Configuración de seguridad:`);
    console.log(`   • JWT configurado: ${jwtConfig.secret ? "SÍ" : "NO"}`);
    console.log(`   • JWT expira en: ${jwtConfig.expiresIn}`);
    console.log(
      `   • CORS orígenes: ${corsConfig.origins.length} configurados`
    );

    console.log(`🔧 Configuración del pool:`);
    console.log(
      `   • Monitoreo habilitado: ${poolConfig.enableMonitoring ? "SÍ" : "NO"}`
    );
    console.log(
      `   • Intervalo de monitoreo: ${poolConfig.monitoringInterval}ms`
    );

    // Inicializar conexión a la base de datos (con logs detallados)
    await initializeDatabase();

    // Mostrar diagnóstico del sistema al iniciar
    if (isDevelopment) {
      const { mostrarDiagnosticoCompleto } = await import(
        "./utils/diagnosticoSistema"
      );
      mostrarDiagnosticoCompleto();
    }

    // Iniciar monitoreo del pool si está habilitado
    if (poolConfig.enableMonitoring) {
      poolMonitor.startMonitoring(poolConfig.monitoringInterval);
      console.log(`🔍 Monitoreo del pool iniciado correctamente`);
    }

    // 🧹 Iniciar limpieza automática de sesiones expiradas
    SesionCleanupService.iniciarLimpiezaAutomatica();
    console.log(`🧹 Limpieza automática de sesiones configurada`);

    // Inicializar limpieza automática de rate limit
    const { inicializarLimpiezaRateLimit } = await import(
      "./middleware/authRateLimiter"
    );
    inicializarLimpiezaRateLimit();

    // Iniciar servidor
    app.listen(serverConfig.port, () => {
      console.log("✅ ===== SERVIDOR INICIADO CORRECTAMENTE =====");
      console.log(`🌐 URL: http://localhost:${serverConfig.port}`);
      console.log(`🕐 Timestamp: ${new Date().toISOString()}`);
      console.log("================================================");
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

// Manejo de señales para cierre graceful
process.on("SIGTERM", async () => {
  console.log("SIGTERM recibido, cerrando servidor...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT recibido, cerrando servidor...");
  await disconnectDatabase();
  process.exit(0);
});

// Iniciar servidor
startServer();

export default app;

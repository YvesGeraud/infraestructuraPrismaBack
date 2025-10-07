import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Determinar el entorno y cargar el archivo .env correspondiente
const envArchivo =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: path.resolve(process.cwd(), envArchivo) });

// ===== CONSTRUIR DATABASE_URL AUTOMÁTICAMENTE =====
// Construir DATABASE_URL a partir de variables separadas para que Prisma la use
const buildDatabaseUrl = () => {
  const dbName = process.env.DBNAMES;
  const dbUser = process.env.DB_USER;
  const dbPassword = process.env.DB_PASSWORD || "";
  const dbHost = process.env.DB_HOST || "localhost";
  const dbPort = process.env.DB_PORT || "3306";

  if (!dbName || !dbUser) {
    throw new Error(
      "DBNAMES y DB_USER son requeridos para construir DATABASE_URL"
    );
  }

  const password = dbPassword ? `:${dbPassword}` : "";
  return `mysql://${dbUser}${password}@${dbHost}:${dbPort}/${dbName}`;
};

// Verificar y configurar DATABASE_URL
if (!process.env.DATABASE_URL) {
  // Si no existe DATABASE_URL, la construimos automáticamente
  const constructedUrl = buildDatabaseUrl();
  process.env.DATABASE_URL = constructedUrl;

  console.log("🔧 ===== CONSTRUCCIÓN AUTOMÁTICA DE DATABASE_URL =====");
  console.log(`📊 Variables de base de datos detectadas:`);
  console.log(`   • DB_HOST: ${process.env.DB_HOST || "localhost"}`);
  console.log(`   • DB_PORT: ${process.env.DB_PORT || "3306"}`);
  console.log(`   • DBNAMES: ${process.env.DBNAMES}`);
  console.log(`   • DB_USER: ${process.env.DB_USER}`);
  console.log(
    `   • DB_PASSWORD: ${
      process.env.DB_PASSWORD ? "***configurado***" : "sin password"
    }`
  );

  // Mostrar URL sin password para seguridad
  const urlSinPassword = constructedUrl.replace(/:([^:@]+)@/, ":***@");
  console.log(`   • DATABASE_URL construida: ${urlSinPassword}`);
  console.log("✅ DATABASE_URL asignada automáticamente para Prisma");
  console.log("================================================");
} else {
  // Si ya existe DATABASE_URL, verificamos que sea válida
  console.log("📋 DATABASE_URL ya estaba configurada manualmente");
  const urlSinPassword = process.env.DATABASE_URL.replace(
    /:([^:@]+)@/,
    ":***@"
  );
  console.log(`   • DATABASE_URL manual: ${urlSinPassword}`);

  // Opcional: Verificar que la URL manual sea consistente con las variables separadas
  const expectedUrl = buildDatabaseUrl();
  if (process.env.DATABASE_URL !== expectedUrl) {
    console.log(
      "⚠️  ADVERTENCIA: DATABASE_URL manual no coincide con variables separadas"
    );
    console.log(`   • Esperado: ${expectedUrl.replace(/:([^:@]+)@/, ":***@")}`);
    console.log(`   • Actual: ${urlSinPassword}`);
    console.log("   • Se usará la DATABASE_URL manual configurada");
  }
}

// Schema de validación para variables de entorno
const envSchema = z.object({
  // Servidor
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  API_URL: z.string().url().optional(),
  HOST: z.string().default("/"),

  // Base de datos - Variables separadas (construye DATABASE_URL automáticamente)
  DBNAMES: z.string().min(1, "DBNAMES es requerida"),
  DB_USER: z.string().min(1, "DB_USER es requerida"),
  DB_PASSWORD: z.string().default(""),
  DB_HOST: z.string().default("localhost"),
  DB_PORT: z.coerce.number().int().default(3306),

  // DATABASE_URL ya NO se espera como variable, se construye automáticamente desde las variables de arriba

  // JWT
  JWT_SECRET: z.string().min(8, "JWT_SECRET debe tener al menos 8 caracteres"),
  JWT_EXPIRES_IN: z.string().default("15m"), // Token corto para seguridad
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"), // Refresh token más largo

  // Bcrypt
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),

  // CORS
  CORS_ORIGINS_DEV: z.string().optional(),
  CORS_ORIGINS_PROD: z.string().optional(),

  // Archivos
  UPLOAD_PATH: z.string().default("./uploads"),
  MAX_FILE_SIZE: z.coerce.number().int().positive().default(10485760),
  ALLOWED_IMAGES: z.string().default("jpg,jpeg,png,gif,webp"),
  ALLOWED_DOCUMENTS: z.string().default("pdf,doc,docx"),

  // Email (opcionales)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  FROM_NAME: z.string().optional(),

  // Pagos (opcionales)
  STRIPE_PUBLIC_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  PAYPAL_CLIENT_ID: z.string().optional(),
  PAYPAL_CLIENT_SECRET: z.string().optional(),
  WEBHOOK_SECRET: z.string().optional(),

  // Logging
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "debug"]).default("info"),
  LOG_FILE: z.string().default("./logs/app.log"),

  // Pool de conexiones
  ENABLE_POOL_MONITORING: z.coerce.boolean().default(false),
  POOL_MONITORING_INTERVAL: z.coerce.number().int().min(1000).default(30000),
});

// Función para validar y obtener las variables de entorno
function validateEnv() {
  try {
    const parsed = envSchema.parse(process.env);
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Error en las variables de entorno:");
      error.issues.forEach((issue) => {
        console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}

// Exportar las variables validadas
export const env = validateEnv();

// Tipo para las variables de entorno
export type Env = z.infer<typeof envSchema>;

// ===== CONFIGURACIÓN DE BASE DE DATOS =====
export const dbConfig = {
  name: env.DBNAMES,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  port: env.DB_PORT,
};

// ===== CONFIGURACIÓN DEL SERVIDOR =====
export const serverConfig = {
  port: env.PORT,
  nodeEnv: env.NODE_ENV,
  apiUrl: env.API_URL,
  host: env.HOST,
};

// ===== CONFIGURACIÓN JWT =====
export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
  refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
};

// ===== CONFIGURACIÓN BCRYPT =====
export const bcryptConfig = {
  rounds: env.BCRYPT_ROUNDS,
};

// ===== HELPERS DE ENTORNO =====
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

// ===== CONFIGURACIÓN CORS =====
export const corsConfig = {
  origins: isProduction
    ? env.CORS_ORIGINS_PROD?.split(",").map((origin) => origin.trim()) || []
    : env.CORS_ORIGINS_DEV?.split(",").map((origin) => origin.trim()) || [
        "http://localhost:4200", // Angular dev server
        "http://localhost:3000", // React dev server
        "http://localhost:5173", // Vite dev server
        "http://localhost:8080", // Vue dev server
        "https://hoppscotch.io", // API testing
      ],
  // Headers adicionales para JWT
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin",
    "X-Request-ID",
    "X-API-Key",
  ],
  exposedHeaders: [
    "X-Total-Count",
    "X-Request-ID",
    "X-RateLimit-Limit",
    "X-RateLimit-Remaining",
    "X-RateLimit-Reset",
  ],
};

// ===== CONFIGURACIÓN DE ARCHIVOS =====
export const fileConfig = {
  uploadPath: env.UPLOAD_PATH,
  maxFileSize: env.MAX_FILE_SIZE,
  allowedImages: env.ALLOWED_IMAGES.split(","),
  allowedDocuments: env.ALLOWED_DOCUMENTS.split(","),
};

// ===== CONFIGURACIÓN DE EMAIL =====
export const emailConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  user: env.SMTP_USER,
  pass: env.SMTP_PASS,
  fromEmail: env.FROM_EMAIL,
  fromName: env.FROM_NAME,
};

// ===== CONFIGURACIÓN DE PAGOS =====
export const paymentConfig = {
  stripe: {
    publicKey: env.STRIPE_PUBLIC_KEY,
    secretKey: env.STRIPE_SECRET_KEY,
  },
  paypal: {
    clientId: env.PAYPAL_CLIENT_ID,
    clientSecret: env.PAYPAL_CLIENT_SECRET,
  },
  webhookSecret: env.WEBHOOK_SECRET,
};

// ===== CONFIGURACIÓN DE LOGGING =====
export const loggingConfig = {
  level: env.LOG_LEVEL,
  file: env.LOG_FILE,
};

// ===== CONFIGURACIÓN DEL POOL =====
export const poolConfig = {
  enableMonitoring: env.ENABLE_POOL_MONITORING,
  monitoringInterval: env.POOL_MONITORING_INTERVAL,
};

// ===== DATABASE URL =====
// Se construye SIEMPRE a partir de las variables separadas
export const getDatabaseUrl = (): string => {
  const password = dbConfig.password ? `:${dbConfig.password}` : "";
  return `mysql://${dbConfig.user}${password}@${dbConfig.host}:${dbConfig.port}/${dbConfig.name}`;
};

// URL completa para Prisma (solo para referencia, Prisma la construye internamente)
export const databaseUrl = getDatabaseUrl();

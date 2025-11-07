import winston from "winston";
import path from "path";

// Configuración de niveles de logging
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

// Configuración de colores para la consola
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

// Formato para archivos de log
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Formato para consola
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Configuración de transports
const transports = [
  // Consola
  new winston.transports.Console({
    format: consoleFormat,
  }),

  // Archivo de errores
  new winston.transports.File({
    filename: path.join(process.cwd(), "logs", "error.log"),
    level: "error",
    format: fileFormat,
  }),

  // Archivo de logs combinados
  new winston.transports.File({
    filename: path.join(process.cwd(), "logs", "combined.log"),
    format: fileFormat,
  }),
];

// Crear el logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // No salir al encontrar un error
  exitOnError: false,
});

// Stream para Morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.substring(0, message.lastIndexOf("\n")));
  },
};

export default logger;

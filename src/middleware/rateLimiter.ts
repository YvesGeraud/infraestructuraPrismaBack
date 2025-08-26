import rateLimit from "express-rate-limit";

// Rate limiter general para API
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Máximo 100 requests por IP en 15 minutos
  message: {
    success: false,
    message: "Demasiadas solicitudes, intenta de nuevo en 15 minutos",
  },
  standardHeaders: true, // Incluir rate limit info en headers `RateLimit-*`
  legacyHeaders: false, // Desactivar headers `X-RateLimit-*`
});

// Rate limiter estricto para autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos de login por IP en 15 minutos
  message: {
    success: false,
    message:
      "Demasiados intentos de autenticación, intenta de nuevo en 15 minutos",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Incrementar el tiempo de bloqueo en intentos repetidos
  skipSuccessfulRequests: true,
});

// Rate limiter para creación de recursos
export const createResourceLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // Máximo 10 creaciones por IP en 1 hora
  message: {
    success: false,
    message: "Demasiadas creaciones de recursos, intenta de nuevo en 1 hora",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter para uploads de archivos
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Máximo 20 uploads por IP en 1 hora
  message: {
    success: false,
    message: "Demasiados uploads de archivos, intenta de nuevo en 1 hora",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

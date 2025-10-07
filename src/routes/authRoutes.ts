/**
 * @fileoverview Rutas de Autenticación
 *
 * Define todos los endpoints para el sistema de autenticación:
 *
 * PÚBLICAS (sin autenticación):
 * - POST /login - Iniciar sesión
 * - POST /refresh - Renovar token
 *
 * PROTEGIDAS (requieren autenticación):
 * - POST /logout - Cerrar sesión
 * - GET /me - Información del usuario actual
 * - GET /verify - Verificar token
 * - GET /sessions - Listar sesiones activas
 * - DELETE /sessions/:sessionId - Cerrar sesión específica
 */

import { Router } from "express";
import authController from "../controllers/auth.controller";
import { validarRequest } from "../middleware/validacion";
import { verificarAutenticacion } from "../middleware/authMiddleware";
import {
  rateLimitLogin,
  rateLimitRefresh,
} from "../middleware/authRateLimiter";
import {
  esquemaLogin,
  esquemaRefreshToken,
  esquemaLogout,
} from "../schemas/auth.schemas";

const router = Router();

// ===== RUTAS PÚBLICAS (NO REQUIEREN AUTENTICACIÓN) =====

/**
 * 🔐 LOGIN DE USUARIO
 * POST /api/auth/login
 *
 * Autentica un usuario y devuelve tokens JWT + refresh token
 * Incluye rate limiting estricto (5 intentos por 15 minutos)
 */
router.post(
  "/login",
  rateLimitLogin, // Rate limiting específico para login
  validarRequest({ body: esquemaLogin }),
  authController.login.bind(authController)
);

/**
 * 🔄 REFRESH TOKEN
 * POST /api/auth/refresh
 *
 * Renueva el access token usando un refresh token válido
 * Incluye rate limiting más permisivo (10 intentos por 5 minutos)
 */
router.post(
  "/refresh",
  rateLimitRefresh, // Rate limiting para refresh
  validarRequest({ body: esquemaRefreshToken }),
  authController.refreshToken.bind(authController)
);

// ===== RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN) =====

/**
 * 🚪 LOGOUT DE USUARIO
 * POST /api/auth/logout
 *
 * Cierra sesión(es) del usuario y revoca refresh tokens
 * Puede cerrar una sesión específica o todas las sesiones
 */
router.post(
  "/logout",
  verificarAutenticacion, // Requiere token válido
  validarRequest({ body: esquemaLogout }),
  authController.logout.bind(authController) as any
);

/**
 * 👤 OBTENER USUARIO ACTUAL
 * GET /api/auth/me
 *
 * Retorna información del usuario autenticado y estadísticas de sesión
 */
router.get(
  "/me",
  verificarAutenticacion,
  authController.obtenerUsuarioActual.bind(authController) as any
);

/**
 * ✅ VERIFICAR TOKEN
 * GET /api/auth/verify
 *
 * Verifica si el token actual es válido y retorna información básica
 * Útil para verificar estado de autenticación desde el frontend
 */
router.get(
  "/verify",
  verificarAutenticacion,
  authController.verificarToken.bind(authController) as any
);

/**
 * 📊 OBTENER SESIONES ACTIVAS
 * GET /api/auth/sessions
 *
 * Lista todas las sesiones activas del usuario actual
 * Útil para mostrar dispositivos conectados
 */
router.get(
  "/sessions",
  verificarAutenticacion,
  authController.obtenerSesionesActivas.bind(authController) as any
);

/**
 * 🗑️ CERRAR SESIÓN ESPECÍFICA
 * DELETE /api/auth/sessions/:sessionId
 *
 * Cierra una sesión específica por su ID
 * Útil para "logout remoto" desde panel de sesiones activas
 */
router.delete(
  "/sessions/:sessionId",
  verificarAutenticacion,
  // TODO: Agregar validación de UUID para sessionId
  authController.cerrarSesionEspecifica.bind(authController) as any
);

export default router;

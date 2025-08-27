import { Router } from "express";
//import { AuthController } from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
//import { verificarAutenticacion } from "../middleware/authMiddleware";
import { authLimiter } from "../middleware/rateLimiter";
/*import {
  esquemaLogin,
  esquemaRefreshToken,
  esquemaLogout,
} from "../schemas/authSchemas";*/

const router = Router();
//const authController = new AuthController();

// ===== RUTAS PÚBLICAS (NO REQUIEREN AUTENTICACIÓN) =====

/**
 * Login de usuario
 * POST /api/auth/login
 */
router.post(
  "/login",
  authLimiter // Rate limiting para intentos de login
  /*validateRequest({ body: esquemaLogin }),
  authController.login.bind(authController)*/
);

/**
 * Refresh token
 * POST /api/auth/refresh
 */
router.post(
  "/refresh"
  /*validateRequest({ body: esquemaRefreshToken }),
  authController.refreshToken.bind(authController)*/
);

/**
 * Logout de usuario
 * POST /api/auth/logout
 */
router.post(
  "/logout"
  /*validateRequest({ body: esquemaLogout }),
  authController.logout.bind(authController)*/
);

// ===== RUTAS PROTEGIDAS (REQUIEREN AUTENTICACIÓN) =====

/**
 * Obtener información del usuario actual
 * GET /api/auth/me
 */
router.get(
  "/me"
  /*verificarAutenticacion,
  authController.obtenerUsuarioActual.bind(authController)*/
);

/**
 * Verificar estado del token
 * GET /api/auth/verify
 */
router.get(
  "/verify"
  /*verificarAutenticacion,
  authController.verificarToken.bind(authController)*/
);

export default router;

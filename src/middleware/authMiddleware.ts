import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import logger from "../config/logger";

const authService = new AuthService();

/**
 * Middleware para verificar autenticación JWT
 */
export const verificarAutenticacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Token de acceso requerido",
      });
      return;
    }

    // Extraer token (remover "Bearer ")
    const token = authHeader.substring(7);

    // Verificar token
    const payload = authService.verificarToken(token);

    if (!payload) {
      res.status(401).json({
        success: false,
        message: "Token inválido o expirado",
      });
      return;
    }

    // Obtener información completa del usuario
    const usuario = await authService.obtenerUsuarioDesdeToken(token);

    if (!usuario || !usuario.isActive) {
      res.status(401).json({
        success: false,
        message: "Usuario no válido o inactivo",
      });
      return;
    }

    // Agregar usuario al request
    req.usuario = payload;

    next();
  } catch (error) {
    logger.error("Error en middleware de autenticación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const verificarRoles = (...rolesPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Verificar que el usuario esté autenticado
      if (!req.usuario) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
        });
        return;
      }

      // Verificar rol
      if (!authService.verificarPermisos(req.usuario.role, rolesPermitidos)) {
        res.status(403).json({
          success: false,
          message: "Permisos insuficientes",
        });
        return;
      }

      next();
    } catch (error) {
      logger.error("Error en middleware de roles:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  };
};

/**
 * Middleware para verificar que el usuario sea ADMIN
 */
export const verificarAdmin = verificarRoles("ADMIN");

/**
 * Middleware opcional de autenticación (no falla si no hay token)
 */
export const autenticacionOpcional = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = authService.verificarToken(token);

      if (payload) {
        const usuario = await authService.obtenerUsuarioDesdeToken(token);
        if (usuario && usuario.isActive) {
          req.usuario = payload;
        }
      }
    }

    // Continuar independientemente de si hay token válido o no
    next();
  } catch (error) {
    logger.error("Error en autenticación opcional:", error);
    // No fallar, continuar sin usuario autenticado
    next();
  }
};

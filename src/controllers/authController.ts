import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import {
  LoginInput,
  RefreshTokenInput,
  LogoutInput,
} from "../schemas/authSchemas";
import { BaseController } from "./BaseController";
import { RespuestaUtil } from "../utils/respuestas";
import logger from "../config/logger";

const authService = new AuthService();

export class AuthController extends BaseController {
  /**
   * Login de usuario
   * POST /api/auth/login
   */
  async login(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(req, res, async () => {
      const datosLogin: LoginInput = req.body;
      const resultado = await authService.login(datosLogin);

      if (!resultado) {
        throw new Error("Credenciales inválidas");
      }

      logger.info(`Usuario logueado: ${datosLogin.email}`);
      return resultado;
    });
  }

  /**
   * Refresh token
   * POST /api/auth/refresh
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(req, res, async () => {
      const { token }: RefreshTokenInput = req.body;
      const resultado = await authService.refreshToken(token);

      if (!resultado) {
        throw new Error("Token inválido o expirado");
      }

      logger.info("Token renovado exitosamente");
      return resultado;
    });
  }

  /**
   * Logout de usuario
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { token }: LogoutInput = req.body;
        const resultado = await authService.logout(token);

        logger.info("Usuario deslogueado");
        return resultado;
      },
      "Logout exitoso"
    );
  }

  /**
   * Obtener información del usuario actual
   * GET /api/auth/me
   */
  async obtenerUsuarioActual(req: Request, res: Response): Promise<void> {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        if (!req.usuario) {
          throw new Error("Usuario no autenticado");
        }

        const usuario = await authService.obtenerUsuarioDesdeToken(
          req.headers.authorization?.substring(7) || ""
        );

        return usuario;
      },
      "Usuario obtenido exitosamente"
    );
  }

  /**
   * Verificar estado del token
   * GET /api/auth/verify
   */
  async verificarToken(req: Request, res: Response): Promise<void> {
    // Si llegamos hasta aquí, el middleware ya verificó el token
    RespuestaUtil.exito(res, { usuario: req.usuario }, "Token válido");
  }
}

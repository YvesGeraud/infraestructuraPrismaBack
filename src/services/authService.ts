import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { jwtConfig } from "../config/env";
import { UserService, UserResponse } from "./userService";
import { PayloadJwt, RespuestaLogin, RespuestaRefresh } from "../types";
import { LoginInput } from "../schemas/authSchemas";

const userService = new UserService();

export class AuthService {
  /**
   * Generar token JWT
   */
  private generarToken(payload: Omit<PayloadJwt, "iat" | "exp">): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      },
      jwtConfig.secret,
      {
        expiresIn: "7d", // Valor fijo temporalmente para resolver el error
      }
    );
  }

  /**
   * Verificar token JWT
   */
  verificarToken(token: string): PayloadJwt | null {
    try {
      const decoded = jwt.verify(token, jwtConfig.secret) as JwtPayload;

      // Verificar que el payload tenga la estructura esperada
      if (decoded && typeof decoded === "object" && "id" in decoded) {
        return decoded as PayloadJwt;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Login de usuario
   */
  async login(datosLogin: LoginInput): Promise<RespuestaLogin | null> {
    try {
      // Verificar credenciales
      const usuario = await userService.verifyCredentials(
        datosLogin.email,
        datosLogin.password
      );

      if (!usuario) {
        return null;
      }

      // Generar token
      const payloadToken: Omit<PayloadJwt, "iat" | "exp"> = {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
      };

      const token = this.generarToken(payloadToken);

      return {
        success: true,
        message: "Login exitoso",
        data: {
          token,
          usuario,
          expiresIn: jwtConfig.expiresIn,
        },
      };
    } catch (error) {
      throw new Error(`Error en login: ${error}`);
    }
  }

  /**
   * Refresh token
   */
  async refreshToken(tokenAntiguo: string): Promise<RespuestaRefresh | null> {
    try {
      // Verificar token actual
      const payload = this.verificarToken(tokenAntiguo);

      if (!payload) {
        return null;
      }

      // Verificar que el usuario aún existe y está activo
      const usuario = await userService.getUserById(payload.id);

      if (!usuario || !usuario.isActive) {
        return null;
      }

      // Generar nuevo token
      const nuevoPayload: Omit<PayloadJwt, "iat" | "exp"> = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };

      const nuevoToken = this.generarToken(nuevoPayload);

      return {
        success: true,
        message: "Token renovado exitosamente",
        data: {
          token: nuevoToken,
          expiresIn: jwtConfig.expiresIn,
        },
      };
    } catch (error) {
      throw new Error(`Error en refresh token: ${error}`);
    }
  }

  /**
   * Logout (invalidar token)
   * Nota: JWT es stateless, por lo que el logout se maneja del lado del cliente
   * eliminando el token. Aquí solo registramos la acción.
   */
  async logout(token?: string): Promise<{ success: boolean; message: string }> {
    try {
      // Si se proporciona token, verificar que sea válido
      if (token) {
        const payload = this.verificarToken(token);
        if (payload) {
          // Aquí podrías agregar el token a una blacklist si implementas una
          // Por ahora solo retornamos éxito
        }
      }

      return {
        success: true,
        message: "Logout exitoso",
      };
    } catch (error) {
      throw new Error(`Error en logout: ${error}`);
    }
  }

  /**
   * Verificar si un usuario tiene los permisos necesarios
   */
  verificarPermisos(usuarioRole: string, rolesPermitidos: string[]): boolean {
    return rolesPermitidos.includes(usuarioRole);
  }

  /**
   * Obtener información del usuario desde el token
   */
  async obtenerUsuarioDesdeToken(token: string): Promise<UserResponse | null> {
    try {
      const payload = this.verificarToken(token);

      if (!payload) {
        return null;
      }

      return await userService.getUserById(payload.id);
    } catch (error) {
      return null;
    }
  }
}

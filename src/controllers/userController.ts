import { Request, Response } from "express";
import { UserService } from "../services/userService";
import {
  CreateUserInput,
  UpdateUserInput,
  ChangePasswordInput,
  LoginInput,
  UserFiltersInput,
  PaginationInput,
} from "../schemas/userSchemas";

const userService = new UserService();

export class UserController {
  /**
   * Crear un nuevo usuario
   * POST /api/users
   */
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateUserInput = req.body;
      const user = await userService.createUser(userData);

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: user,
      });
    } catch (error) {
      console.error("Error al crear usuario:", error);

      if (error instanceof Error) {
        if (error.message.includes("email ya está registrado")) {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener usuario por ID
   * GET /api/users/:id
   */
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "ID de usuario inválido",
        });
        return;
      }

      const user = await userService.getUserById(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Obtener usuarios con filtros y paginación
   * GET /api/users
   */
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const filters: UserFiltersInput = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const result = await userService.getUsers(filters, pagination);

      res.json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Actualizar usuario
   * PUT /api/users/:id
   */
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "ID de usuario inválido",
        });
        return;
      }

      const userData: UpdateUserInput = req.body;
      const user = await userService.updateUser(userId, userData);

      res.json({
        success: true,
        message: "Usuario actualizado exitosamente",
        data: user,
      });
    } catch (error) {
      console.error("Error al actualizar usuario:", error);

      if (error instanceof Error) {
        if (error.message.includes("no encontrado")) {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }

        if (error.message.includes("email ya está registrado")) {
          res.status(409).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Eliminar usuario (soft delete)
   * DELETE /api/users/:id
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "ID de usuario inválido",
        });
        return;
      }

      await userService.deleteUser(userId);

      res.json({
        success: true,
        message: "Usuario eliminado exitosamente",
      });
    } catch (error) {
      console.error("Error al eliminar usuario:", error);

      if (error instanceof Error && error.message.includes("no encontrado")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Cambiar contraseña
   * POST /api/users/:id/change-password
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "ID de usuario inválido",
        });
        return;
      }

      const { currentPassword, newPassword }: ChangePasswordInput = req.body;

      await userService.changePassword(userId, currentPassword, newPassword);

      res.json({
        success: true,
        message: "Contraseña cambiada exitosamente",
      });
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);

      if (error instanceof Error) {
        if (
          error.message.includes("no encontrado") ||
          error.message.includes("incorrecta")
        ) {
          res.status(400).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  /**
   * Verificar credenciales (login)
   * POST /api/users/verify-credentials
   */
  async verifyCredentials(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginInput = req.body;

      const user = await userService.verifyCredentials(email, password);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Credenciales inválidas",
        });
        return;
      }

      res.json({
        success: true,
        message: "Credenciales válidas",
        data: user,
      });
    } catch (error) {
      console.error("Error al verificar credenciales:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}

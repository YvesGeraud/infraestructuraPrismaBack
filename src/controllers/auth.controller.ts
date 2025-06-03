import { Request, Response } from "express";
import authService from "../services/auth.service";

class AuthController {
  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { usuario, contrasena } = req.body;

      if (!usuario || !contrasena) {
        res.status(400).json({
          message: "Usuario y contraseña son obligatorios",
        });
        return;
      }

      const result = await authService.login(usuario, contrasena);
      res.json(result);
    } catch (err) {
      console.error("Error en el login:", err);
      res.status(401).json({
        message: "Credenciales inválidas",
      });
    }
  }
}

export default new AuthController();

import { Request, Response } from "express";
import CtInventarioService from "../../services/inventario/ct_inventario.service";

export class CtInventarioController {
  //* Obtener todos los inventarios
  async obtenerInventario(req: Request, res: Response) {
    try {
      const inventario = await CtInventarioService.obtenerInventario();
      res.json(inventario);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el inventario controller",
      });
      console.error("Error al obtener el inventario controller:", error);
    }
  }
}

export default new CtInventarioController();

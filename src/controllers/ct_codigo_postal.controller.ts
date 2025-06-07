import { Request, Response } from "express";
import ctCodigoPostalService from "../services/ct_codigo_postal.service";

class ctCodigoPostalController {
  async obtenerCodigosPostales(req: Request, res: Response) {
    try {
      const codigosPostales =
        await ctCodigoPostalService.obtenerCodigosPostales();
      res.status(200).json(codigosPostales);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener los códigos postales controller",
      });
      console.error("Error al obtener los códigos postales controller:", error);
    }
  }
}

export default new ctCodigoPostalController();

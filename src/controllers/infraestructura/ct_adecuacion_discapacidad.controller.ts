import { Request, Response } from "express";
import CtAdecuacionDiscapacidadService from "../../services/infraestructura/ct_adecuacion_discapacidad.service";

export class CtAdecuacionDiscapacidadController {
  //* Obtener todas las adecuaciones de discapacidad
  async obtenerAdecuacionDiscapacidad(req: Request, res: Response) {
    try {
      const adecuacionDiscapacidad =
        await CtAdecuacionDiscapacidadService.obtenerAdecuacionDiscapacidad();
      res.json(adecuacionDiscapacidad);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener las adecuaciones de discapacidad controller",
      });
      console.error(
        "Error al obtener las adecuaciones de discapacidad controller:",
        error
      );
    }
  }
}

export default new CtAdecuacionDiscapacidadController();

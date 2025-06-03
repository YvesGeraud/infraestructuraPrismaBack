import { Request, Response } from "express";
import CtSenalamientoDiscapacidadService from "../../services/infraestructura/ct_senalamiento_discapacidad.service";

export class CtSenalamientoDiscapacidadController {
  //* Obtener todos los senalamientos de discapacidad
  async obtenerSenalamientoDiscapacidad(req: Request, res: Response) {
    try {
      const senalamientoDiscapacidad =
        await CtSenalamientoDiscapacidadService.obtenerSenalamientoDiscapacidad();
      res.json(senalamientoDiscapacidad);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener las senalamientos de discapacidad controller",
      });
      console.error(
        "Error al obtener las senalamientos de discapacidad controller:",
        error
      );
    }
  }
}

export default new CtSenalamientoDiscapacidadController();

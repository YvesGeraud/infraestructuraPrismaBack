import { Request, Response } from "express";
import CtAreaDeServicioService from "../../services/infraestructura/ct_area_de_servicio.service";

export class CtAreaDeServicioController {
  //* Obtener todos los tipos de área de servicio
  async obtenerAreaDeServicio(req: Request, res: Response) {
    try {
      const areaDeServicio =
        await CtAreaDeServicioService.obtenerAreaDeServicio();
      res.json(areaDeServicio);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener el área de servicio controller",
      });
      console.error("Error al obtener el área de servicio controller:", error);
    }
  }
}

export default new CtAreaDeServicioController();

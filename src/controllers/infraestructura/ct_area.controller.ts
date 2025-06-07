import { Request, Response } from "express";
import CtAreaService from "../../services/infraestructura/ct_area.service";

export class CtAreaController {
  //* Obtener todas las áreas
  async obtenerArea(req: Request, res: Response) {
    try {
      const area = await CtAreaService.obtenerArea();
      res.json(area);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener las áreas controller" });
      console.error("Error al obtener las áreas controller:", error);
    }
  }

  //* Obtener una área por su id
  async obtenerAreaById(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const area = await CtAreaService.obtenerAreaById(parseInt(id));
      res.json(area);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener la área controller" });
      console.error("Error al obtener la área controller:", error);
    }
  }

  //* Obtener todas las áreas con relaciones
  async obtenerAreasConRelaciones(req: Request, res: Response) {
    try {
      const areas = await CtAreaService.obtenerAreasConRelaciones();
      res.json(areas);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener las áreas con relaciones controller",
      });
      console.error(
        "Error al obtener las áreas con relaciones controller:",
        error
      );
    }
  }
}

export default new CtAreaController();

import { Request, Response } from "express";
import ctLocalidadService from "../services/ct_localidad.service";

class CtLocalidadController {
  //* Obtener todas las localidades
  async obtenerLocalidades(req: Request, res: Response) {
    try {
      const localidades = await ctLocalidadService.obtenerLocalidades();
      res.status(200).json(localidades);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener las localidades controller",
      });
      console.error("Error al obtener las localidades controller:", error);
    }
  }

  //* Obtener todas las localidades con municipio
  async obtenerLocalidadesConMunicipio(req: Request, res: Response) {
    try {
      const localidad = await ctLocalidadService.obtenerLocalidadesConMunicipio(
        parseInt(req.params.id)
      );
      res.status(200).json(localidad);
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener las localidades con municipio controller",
      });
      console.error(
        "Error al obtener las localidades con municipio controller:",
        error
      );
    }
  }

  //* Obtener una localidad por su ID
  async obtenerLocalidadPorId(req: Request, res: Response) {
    const localidad = await ctLocalidadService.obtenerLocalidadPorId(
      parseInt(req.params.id)
    );
    res.status(200).json(localidad);
  }
}

export default new CtLocalidadController();

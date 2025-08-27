import { Request, Response } from "express";
import {
  CrearCtEntidadInput,
  ActualizarCtEntidadInput,
  CtEntidadIdParam,
} from "../schemas/ct_entidad.schema";
import { PaginationInput } from "../schemas/commonSchemas";
import { CtEntidadService } from "../services/ct_entidad.service";

//TODO ===== CONTROLADOR PARA CT_ENTIDAD =====
const ctEntidadService = new CtEntidadService();

export class CtEntidadController {
  //? Crear una nueva entidad
  //TODO POST /api/ct_entidad

  async crearCtEntidad(req: Request, res: Response): Promise<void> {
    try {
      const ctEntidadData: CrearCtEntidadInput = req.body;
      const ctEntidad = await ctEntidadService.createCtEntidad(ctEntidadData);

      res.status(201).json({
        success: true,
        message: "Entidad creada exitosamente",
        data: ctEntidad,
      });
    } catch (error) {
      console.error("Error al crear entidad:", error);

      if (error instanceof Error) {
        if (error.message.includes("Entidad ya existe")) {
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

  //? Obtener una entidad
  //TODO GET /api/ct_entidad/:id_entidad

  async obtenerCtEntidadPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id_entidad } = req.params;

      //? Convertir el ID de entidad a número
      const id_entidad_numero = parseInt(id_entidad, 10);

      //? Verificar si el ID de entidad es un número
      if (isNaN(id_entidad_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de entidad inválido",
        });
        return;
      }

      //? Obtener la entidad
      const ctEntidad = await ctEntidadService.obtenerCtEntidad(
        id_entidad_numero
      );

      //? Verificar si la entidad existe
      if (!ctEntidad) {
        res.status(404).json({
          success: false,
          message: "Entidad no encontrada",
        });
        return;
      }

      //? Enviar la respuesta
      res.json({
        success: true,
        data: ctEntidad,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al obtener entidad:", error);

      //? Enviar respuesta de error
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Obtener todas las entidades
  //TODO GET /api/ct_entidad

  async obtenerTodosLosCtEntidad(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const resultado = await ctEntidadService.obtenerTodosLosCtEntidad(
        filters,
        pagination
      );

      res.json({
        success: true,
        ...resultado,
      });
    } catch (error) {
      console.error("Error al obtener entidades:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Actualizar una entidad
  //TODO PUT /api/ct_entidad/:id_entidad

  async actualizarCtEntidad(req: Request, res: Response): Promise<void> {
    try {
      const { id_entidad } = req.params;
      const id_entidad_numero = parseInt(id_entidad, 10);

      //? Verificar si el ID de entidad es un número
      if (isNaN(id_entidad_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de entidad inválido",
        });
        return;
      }

      const ctEntidadData: ActualizarCtEntidadInput = req.body;
      const ctEntidad = await ctEntidadService.actualizarCtEntidad(
        id_entidad_numero,
        ctEntidadData
      );

      //? Enviar la respuesta
      res.json({
        success: true,
        message: "Entidad actualizada exitosamente",
        data: ctEntidad,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al actualizar entidad:", error);

      //? Manejar errores específicos
      if (error instanceof Error) {
        if (error.message.includes("Entidad no encontrada")) {
          res.status(404).json({
            success: false,
            message: error.message,
          });
          return;
        }
      }

      //? Enviar respuesta de error
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Eliminar una entidad
  //TODO DELETE /api/ct_entidad/:id_entidad

  async eliminarCtEntidad(req: Request, res: Response): Promise<void> {
    try {
      const { id_entidad } = req.params;
      const id_entidad_numero = parseInt(id_entidad, 10);

      //? Verificar si el ID de entidad es un número
      if (isNaN(id_entidad_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de entidad inválido",
        });
        return;
      }

      //? Eliminar la entidad
      await ctEntidadService.eliminarCtEntidad(id_entidad_numero);

      //? Enviar la respuesta
      res.json({
        success: true,
        message: "Entidad eliminada exitosamente",
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al eliminar entidad:", error);

      //? Manejar errores específicos
      if (error instanceof Error && error.message.includes("no encontrado")) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }

      //? Enviar respuesta de error
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }
}

import { Request, Response } from "express";
import { CtUnidadService } from "../../services/infraestructura/ct_unidad.service";
import {
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
} from "../../schemas/infraestructura/ct_unidad.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_UNIDAD =====
const ctUnidadService = new CtUnidadService();

export class CtUnidadController {
  //? Crear una nueva unidad de infraestructura
  //TODO POST /api/ct_unidad

  async crearUnidad(req: Request, res: Response): Promise<void> {
    try {
      const unidadData: CrearCtUnidadInput = req.body;
      const unidad = await ctUnidadService.crearUnidad(unidadData);

      res.status(201).json({
        success: true,
        message: "Unidad creada exitosamente",
        data: unidad,
      });
    } catch (error) {
      console.error("Error al crear unidad:", error);

      if (error instanceof Error) {
        if (error.message.includes("CCT ya existe")) {
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

  //? Obtener una unidad por ID
  //TODO GET /api/ct_unidad/:id_unidad

  async obtenerUnidadPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id_unidad } = req.params;

      //? Convertir el ID de unidad a número
      const id_unidad_numero = parseInt(id_unidad, 10);

      //? Verificar si el ID de unidad es un número
      if (isNaN(id_unidad_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de unidad inválido",
        });
        return;
      }

      //? Obtener la unidad
      const unidad = await ctUnidadService.obtenerUnidadPorId(id_unidad_numero);

      //? Verificar si la unidad existe
      if (!unidad) {
        res.status(404).json({
          success: false,
          message: "Unidad no encontrada",
        });
        return;
      }

      //? Enviar la respuesta
      res.json({
        success: true,
        data: unidad,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al obtener unidad:", error);

      //? Enviar respuesta de error
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Obtener todas las unidades con filtros y paginación
  //TODO GET /api/ct_unidad

  async obtenerTodosLosCtUnidades(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const resultado = await ctUnidadService.obtenerUnidades(
        filters,
        pagination
      );

      res.json({
        success: true,
        ...resultado,
      });
    } catch (error) {
      console.error("Error al obtener unidades:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Actualizar una unidad
  //TODO PUT /api/ct_unidad/:id_unidad

  async actualizarUnidad(req: Request, res: Response): Promise<void> {
    try {
      const { id_unidad } = req.params;
      const id_unidad_numero = parseInt(id_unidad, 10);

      //? Verificar si el ID de unidad es un número
      if (isNaN(id_unidad_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de unidad inválido",
        });
        return;
      }

      const unidadData: ActualizarCtUnidadInput = req.body;
      const unidad = await ctUnidadService.actualizarUnidad(
        id_unidad_numero,
        unidadData
      );

      //? Enviar la respuesta
      res.json({
        success: true,
        message: "Unidad actualizada exitosamente",
        data: unidad,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al actualizar unidad:", error);

      //? Manejar errores específicos
      if (error instanceof Error) {
        if (error.message.includes("Unidad no encontrada")) {
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

  //? Eliminar una unidad
  //TODO DELETE /api/ct_unidad/:id_unidad

  async eliminarUnidad(req: Request, res: Response): Promise<void> {
    try {
      const { id_unidad } = req.params;
      const id_unidad_numero = parseInt(id_unidad, 10);

      //? Verificar si el ID de unidad es un número
      if (isNaN(id_unidad_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de unidad inválido",
        });
        return;
      }

      //? Eliminar el alumno
      await ctUnidadService.eliminarUnidad(id_unidad_numero);

      //? Enviar la respuesta
      res.json({
        success: true,
        message: "Alumno eliminado exitosamente",
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al eliminar alumno:", error);

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

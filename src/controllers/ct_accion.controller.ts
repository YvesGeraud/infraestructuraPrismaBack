import { Request, Response } from "express";
import { CtAccionService } from "../services/ct_accion.service";
import {
  CrearCtAccionInput,
  ActualizarCtAccionInput,
  CtAccionIdParam,
} from "../schemas/ct_accion.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA DT_ESCUELA_ALUMNO =====
const ctAccionService = new CtAccionService();

export class DtEscuelaAlumnoController {
  //? Crear un nuevo registro de alumno en la escuela
  //TODO POST /api/dt_escuela_alumno

  async crearDtEscuelaAlumno(req: Request, res: Response): Promise<void> {
    try {
      const dtEscuelaAlumnoData: CrearCtAccionInput = req.body;
      const dtEscuelaAlumno = await ctAccionService.createCtAccion(
        dtEscuelaAlumnoData
      );

      res.status(201).json({
        success: true,
        message: "Alumno creado exitosamente",
        data: dtEscuelaAlumno,
      });
    } catch (error) {
      console.error("Error al crear alumno:", error);

      if (error instanceof Error) {
        if (error.message.includes("CURP ya existe")) {
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

  //? Obtener un registro de alumno en la escuela
  //TODO GET /api/dt_escuela_alumno/:id_escuela_alumno

  async obtenerCtAccionPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id_escuela_alumno } = req.params;

      //? Convertir el ID de alumno a número
      const id_escuela_alumno_numero = parseInt(id_escuela_alumno, 10);

      //? Verificar si el ID de alumno es un número
      if (isNaN(id_escuela_alumno_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de alumno inválido",
        });
        return;
      }

      //? Obtener el alumno
      const dtEscuelaAlumno = await ctAccionService.obtenerCtAccion(
        id_escuela_alumno_numero
      );

      //? Verificar si el alumno existe
      if (!dtEscuelaAlumno) {
        res.status(404).json({
          success: false,
          message: "Alumno no encontrado",
        });
        return;
      }

      //? Enviar la respuesta
      res.json({
        success: true,
        data: dtEscuelaAlumno,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al obtener alumno:", error);

      //? Enviar respuesta de error
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Obtener todos los registros de alumnos en la escuela
  //TODO GET /api/dt_escuela_alumno

  async obtenerTodosLosCtAccion(req: Request, res: Response): Promise<void> {
    try {
      const filters: any = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const resultado = await ctAccionService.obtenerTodosLosCtAccion(
        filters,
        pagination
      );

      res.json({
        success: true,
        ...resultado,
      });
    } catch (error) {
      console.error("Error al obtener alumnos:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Actualizar un registro de alumno en la escuela
  //TODO PUT /api/dt_escuela_alumno/:id_escuela_alumno

  async actualizarCtAccion(req: Request, res: Response): Promise<void> {
    try {
      const { id_escuela_alumno } = req.params;
      const id_escuela_alumno_numero = parseInt(id_escuela_alumno, 10);

      //? Verificar si el ID de alumno es un número
      if (isNaN(id_escuela_alumno_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de alumno inválido",
        });
        return;
      }

      const dtEscuelaAlumnoData: ActualizarCtAccionInput = req.body;
      const dtEscuelaAlumno = await ctAccionService.actualizarCtAccion(
        id_escuela_alumno_numero,
        dtEscuelaAlumnoData
      );

      //? Enviar la respuesta
      res.json({
        success: true,
        message: "Alumno actualizado exitosamente",
        data: dtEscuelaAlumno,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al actualizar alumno:", error);

      //? Manejar errores específicos
      if (error instanceof Error) {
        if (error.message.includes("Alumno no encontrado")) {
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

  //? Eliminar un registro de alumno en la escuela
  //TODO DELETE /api/dt_escuela_alumno/:id_escuela_alumno

  async eliminarCtAccion(req: Request, res: Response): Promise<void> {
    try {
      const { id_escuela_alumno } = req.params;
      const id_escuela_alumno_numero = parseInt(id_escuela_alumno, 10);

      //? Verificar si el ID de alumno es un número
      if (isNaN(id_escuela_alumno_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de alumno inválido",
        });
        return;
      }

      //? Eliminar el alumno
      await ctAccionService.eliminarCtAccion(id_escuela_alumno_numero);

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

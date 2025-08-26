import { Request, Response } from "express";
import { DtEscuelaAlumnoService } from "../services/dt_escuela_alumno.service";
import {
  CrearDtEscuelaAlumnoInput,
  ActualizarDtEscuelaAlumnoInput,
  DtEscuelaAlumnoFiltersInput,
  DtEscuelaAlumnoIdParam,
} from "../schemas/dt_escuela_alumno.schema";
import { PaginationInput } from "../schemas/userSchemas";

//TODO ===== CONTROLADOR PARA DT_ESCUELA_ALUMNO =====
const dtEscuelaAlumnoService = new DtEscuelaAlumnoService();

export class DtEscuelaAlumnoController {
  //? Crear un nuevo registro de alumno en la escuela
  //TODO POST /api/dt_escuela_alumno

  async crearDtEscuelaAlumno(req: Request, res: Response): Promise<void> {
    try {
      const dtEscuelaAlumnoData: CrearDtEscuelaAlumnoInput = req.body;
      const dtEscuelaAlumno =
        await dtEscuelaAlumnoService.createDtEscuelaAlumno(dtEscuelaAlumnoData);

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

  async obtenerDtEscuelaAlumnoPorId(
    req: Request,
    res: Response
  ): Promise<void> {
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
      const dtEscuelaAlumno =
        await dtEscuelaAlumnoService.obtenerDtEscuelaAlumno(
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

  async obtenerTodosLosDtEscuelaAlumno(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const filters: DtEscuelaAlumnoFiltersInput = req.query as any;
      const pagination: PaginationInput = req.query as any;

      const resultado =
        await dtEscuelaAlumnoService.obtenerTodosLosDtEscuelaAlumno(
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

  async actualizarDtEscuelaAlumno(req: Request, res: Response): Promise<void> {
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

      const dtEscuelaAlumnoData: ActualizarDtEscuelaAlumnoInput = req.body;
      const dtEscuelaAlumno =
        await dtEscuelaAlumnoService.actualizarDtEscuelaAlumno(
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

  async eliminarDtEscuelaAlumno(req: Request, res: Response): Promise<void> {
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
      await dtEscuelaAlumnoService.eliminarDtEscuelaAlumno(
        id_escuela_alumno_numero
      );

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

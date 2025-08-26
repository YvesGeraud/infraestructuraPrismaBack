import { Request, Response } from "express";
import { RlEscuelaAlumnoGradoService } from "../services/rl_escuela_alumno_grado.service";
import {
  CrearRlEscuelaAlumnoGradoInput,
  ActualizarRlEscuelaAlumnoGradoInput,
  RlEscuelaAlumnoGradoFiltersInput,
  RlEscuelaAlumnoGradoIdParam,
} from "../schemas/rl_escuela_alumno_grado.schema";
import { PaginationInput } from "../schemas/userSchemas";

//TODO ===== CONTROLADOR PARA DT_ESCUELA_ALUMNO =====
const rlEscuelaAlumnoGradoService = new RlEscuelaAlumnoGradoService();

export class RlEscuelaAlumnoGradoController {
  //? Crear un nuevo registro de alumno en la escuela
  //TODO POST /api/rl_escuela_alumno_grado

  async crearRlEscuelaAlumnoGrado(req: Request, res: Response): Promise<void> {
    try {
      const rlEscuelaAlumnoGradoData: CrearRlEscuelaAlumnoGradoInput = req.body;
      const rlEscuelaAlumnoGrado =
        await rlEscuelaAlumnoGradoService.createRlEscuelaAlumnoGrado(
          rlEscuelaAlumnoGradoData
        );

      res.status(201).json({
        success: true,
        message: "Alumno creado exitosamente",
        data: rlEscuelaAlumnoGrado,
      });
    } catch (error) {
      console.error("Error al crear alumno:", error);

      if (error instanceof Error) {
        if (error.message.includes("Alumno no existe en el sistema")) {
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
  //TODO GET /api/rl_escuela_alumno_grado/:id_escuela_alumno_grado

  async obtenerRlEscuelaAlumnoGradoPorId(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id_escuela_alumno_grado } = req.params;

      //? Convertir el ID de alumno a número
      const id_escuela_alumno_grado_numero = parseInt(
        id_escuela_alumno_grado,
        10
      );

      //? Verificar si el ID de alumno es un número
      if (isNaN(id_escuela_alumno_grado_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de alumno inválido",
        });
        return;
      }

      // Extraer opciones de include de query params
      const includeOptions = {
        includeAlumno: req.query.includeAlumno === "true",
      };

      //? Obtener el alumno
      const rlEscuelaAlumnoGrado =
        await rlEscuelaAlumnoGradoService.obtenerRlEscuelaAlumnoGrado(
          id_escuela_alumno_grado_numero,
          includeOptions
        );

      //? Verificar si el alumno existe
      if (!rlEscuelaAlumnoGrado) {
        res.status(404).json({
          success: false,
          message: "Alumno no encontrado",
        });
        return;
      }

      //? Enviar la respuesta
      res.json({
        success: true,
        data: rlEscuelaAlumnoGrado,
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
  //TODO GET /api/rl_escuela_alumno_grado

  async obtenerTodosLosRlEscuelaAlumnoGrado(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const queryData: RlEscuelaAlumnoGradoFiltersInput & PaginationInput =
        req.query as any;

      // Separar filtros, paginación e includes
      const filters = {
        id_escuela_alumno: queryData.id_escuela_alumno,
        id_escuela_plantel: queryData.id_escuela_plantel,
        id_escuela_ciclo_escolar: queryData.id_escuela_ciclo_escolar,
        nivel: queryData.nivel,
        grado: queryData.grado,
        intento: queryData.intento,
        id_escuela_alumno_estatus: queryData.id_escuela_alumno_estatus,
        id_escuela_alumno_estatus_grado:
          queryData.id_escuela_alumno_estatus_grado,
      };

      const pagination: PaginationInput = {
        page: queryData.page,
        limit: queryData.limit,
      };

      // Extraer opciones de include (ya transformadas por Zod)
      const includeOptions = {
        includeAlumno: queryData.includeAlumno || false,
      };

      //? Obtener todos los alumnos
      const resultado =
        await rlEscuelaAlumnoGradoService.obtenerTodosLosRlEscuelaAlumnoGrado(
          filters,
          pagination,
          includeOptions
        );

      //? Enviar la respuesta
      res.json({
        success: true,
        ...resultado,
      });
    } catch (error) {
      //? Manejar errores
      console.error("Error al obtener alumnos:", error);

      //? Enviar respuesta de error
      res.status(500).json({
        success: false,
        message: "Error interno del servidor",
      });
    }
  }

  //? Actualizar un registro de alumno en la escuela
  //TODO PUT /api/rl_escuela_alumno_grado/:id_escuela_alumno_grado

  async actualizarRlEscuelaAlumnoGrado(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id_escuela_alumno_grado } = req.params;
      const id_escuela_alumno_grado_numero = parseInt(
        id_escuela_alumno_grado,
        10
      );

      //? Verificar si el ID de alumno es un número
      if (isNaN(id_escuela_alumno_grado_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de alumno inválido",
        });
        return;
      }

      const rlEscuelaAlumnoGradoData: ActualizarRlEscuelaAlumnoGradoInput =
        req.body;
      const rlEscuelaAlumnoGrado =
        await rlEscuelaAlumnoGradoService.actualizarRlEscuelaAlumnoGrado(
          id_escuela_alumno_grado_numero,
          rlEscuelaAlumnoGradoData
        );

      //? Enviar la respuesta
      res.json({
        success: true,
        message: "Alumno actualizado exitosamente",
        data: rlEscuelaAlumnoGrado,
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
  //TODO DELETE /api/rl_escuela_alumno_grado/:id_escuela_alumno_grado

  async eliminarRlEscuelaAlumnoGrado(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id_escuela_alumno_grado } = req.params;
      const id_escuela_alumno_grado_numero = parseInt(
        id_escuela_alumno_grado,
        10
      );

      //? Verificar si el ID de alumno es un número
      if (isNaN(id_escuela_alumno_grado_numero)) {
        res.status(400).json({
          success: false,
          message: "ID de alumno inválido",
        });
        return;
      }

      //? Eliminar el alumno
      await rlEscuelaAlumnoGradoService.eliminarRlEscuelaAlumnoGrado(
        id_escuela_alumno_grado_numero
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

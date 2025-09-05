/**
 * @fileoverview Controlador de localidades
 * Implementa la interfaz IControladorLocalidad y usa el servicio tipado
 * Maneja todas las peticiones HTTP relacionadas con localidades
 */

import { Request, Response } from "express";
import ctLocalidadService, {
  ErrorServicioLocalidad,
} from "../services/ct_localidad.service";
import {
  enviarRespuestaExitosa,
  enviarRespuestaCreado,
  enviarRespuestaError,
  enviarRespuestaNoEncontrado,
  manejarErrorAsincrono,
} from "../utils/response.utils";
import { CodigosError } from "../types/response.types";
import { IControladorLocalidad } from "../interfaces/ct_localidad.interface";
import {
  CrearLocalidadInput,
  ActualizarLocalidadInput,
  FiltrosLocalidadInput,
  ConsultaLocalidadInput,
  ParametroIdInput,
} from "../schemas/localidad.schemas";

/**
 * Controlador de localidades que usa interfaces tipadas
 * Demuestra cómo usar interfaces sin implementar explícitamente
 */
class CtLocalidadController {
  /**
   * Obtener todas las localidades con filtros opcionales
   * GET /api/localidad?ambito=U&buscar=centro&pagina=1&limite=10
   */
  obtenerTodos = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Los filtros ya fueron validados y transformados por el middleware
        // El middleware filtrosLocalidadSchema ya convierte strings a tipos correctos
        const filtros = req.query as FiltrosLocalidadInput;

        // Usar el servicio tipado
        const localidades = await ctLocalidadService.obtenerTodos(filtros);

        enviarRespuestaExitosa(res, {
          datos: localidades,
          mensaje: "Localidades obtenidas exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerTodos:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidades",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Obtener una localidad por ID
   * GET /api/localidades/:id
   */
  obtenerPorId = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
          return enviarRespuestaError(res, {
            mensaje: "ID inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El ID debe ser un número positivo",
          });
        }

        const localidad = await ctLocalidadService.obtenerPorId(id);

        if (!localidad) {
          return enviarRespuestaNoEncontrado(res, "Localidad no encontrada");
        }

        enviarRespuestaExitosa(res, {
          datos: localidad,
          mensaje: "Localidad obtenida exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerPorId:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Crear una nueva localidad
   * POST /api/localidades
   * Body: { "nombre": "San José", "ambito": "R", "idMunicipio": 123 }
   */
  crear = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const datos: CrearLocalidadInput = req.body;

        // Validaciones básicas ya manejadas por middleware de validación
        if (!datos.nombre) {
          return enviarRespuestaError(res, {
            mensaje: "Datos de entrada inválidos",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El nombre de la localidad es requerido",
          });
        }

        // Crear usando el servicio tipado
        const nuevaLocalidad = await ctLocalidadService.crear(datos);

        enviarRespuestaCreado(res, nuevaLocalidad, "Localidad creada exitosamente");
      } catch (error) {
        console.error("Error en crear:", error);

        // Manejar errores específicos de validación de negocio
        if (error instanceof Error && error.message.includes("Ya existe")) {
          return enviarRespuestaError(res, {
            mensaje: error.message,
            codigoError: CodigosError.RECURSO_YA_EXISTE,
            detalles: "Localidad duplicada",
          });
        }

        if (error instanceof Error && error.message.includes("no existe")) {
          return enviarRespuestaError(res, {
            mensaje: error.message,
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Municipio no encontrado",
          });
        }

        enviarRespuestaError(res, {
          mensaje: "Error al crear localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Actualizar una localidad existente
   * PUT /api/localidades/:id
   * Body: { "nombre": "San José Centro" }
   */
  actualizar = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const datos: ActualizarLocalidadInput = req.body;

        if (isNaN(id) || id <= 0) {
          return enviarRespuestaError(res, {
            mensaje: "ID inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El ID debe ser un número positivo",
          });
        }

        // Verificar que hay datos para actualizar
        if (!datos.nombre && !datos.ambito && !datos.idMunicipio) {
          return enviarRespuestaError(res, {
            mensaje: "No hay datos para actualizar",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Debe proporcionar al menos un campo para actualizar",
          });
        }

        const localidadActualizada = await ctLocalidadService.actualizar(id, datos);

        enviarRespuestaExitosa(res, {
          datos: localidadActualizada,
          mensaje: "Localidad actualizada exitosamente",
        });
      } catch (error) {
        console.error("Error en actualizar:", error);

        if (error instanceof Error && error.message.includes("no encontrada")) {
          return enviarRespuestaNoEncontrado(res, "Localidad no encontrada");
        }

        if (error instanceof Error && error.message.includes("Ya existe")) {
          return enviarRespuestaError(res, {
            mensaje: error.message,
            codigoError: CodigosError.RECURSO_YA_EXISTE,
            detalles: "Localidad duplicada",
          });
        }

        if (error instanceof Error && error.message.includes("no existe")) {
          return enviarRespuestaError(res, {
            mensaje: error.message,
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Municipio no encontrado",
          });
        }

        enviarRespuestaError(res, {
          mensaje: "Error al actualizar localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Eliminar una localidad
   * DELETE /api/localidades/:id
   */
  eliminar = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const id = parseInt(req.params.id);

        if (isNaN(id) || id <= 0) {
          return enviarRespuestaError(res, {
            mensaje: "ID inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El ID debe ser un número positivo",
          });
        }

        const eliminado = await ctLocalidadService.eliminar(id);

        if (!eliminado) {
          return enviarRespuestaNoEncontrado(res, "Localidad no encontrada");
        }

        enviarRespuestaExitosa(res, {
          datos: { eliminado: true },
          mensaje: "Localidad eliminada exitosamente",
        });
      } catch (error) {
        console.error("Error en eliminar:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al eliminar localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Método adicional: Buscar localidades por nombre
   * GET /api/localidades/buscar/:nombre
   */
  buscarPorNombre = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const nombre = req.params.nombre;

        if (!nombre || nombre.trim().length === 0) {
          return enviarRespuestaError(res, {
            mensaje: "Nombre de búsqueda inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Debe proporcionar un nombre válido para buscar",
          });
        }

        const localidades = await ctLocalidadService.buscarPorNombre(nombre);

        enviarRespuestaExitosa(res, {
          datos: localidades,
          mensaje: `Localidades encontradas para '${nombre}'`,
        });
      } catch (error) {
        console.error("Error en buscarPorNombre:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al buscar localidades por nombre",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  // ========================================================================
  // MÉTODOS LEGACY - Mantener por compatibilidad (DEPRECATED)
  // Se recomienda usar los métodos principales con filtros
  // ========================================================================

  /**
   * Obtener localidades con filtros avanzados (legacy)
   * @deprecated Usar obtenerTodos() en su lugar
   */
  obtenerLocalidades = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Validar query parameters si existen
        const filtrosValidados =
          Object.keys(req.query).length > 0
            ? ctLocalidadService.validarParametrosConsulta(req.query)
            : undefined;

        const localidades = await ctLocalidadService.obtenerLocalidades(
          filtrosValidados
        );

        enviarRespuestaExitosa(res, {
          datos: localidades,
          mensaje: "Localidades obtenidas exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerLocalidades (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidades",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Obtener una localidad por ID con opciones de inclusión (legacy)
   * @deprecated Usar obtenerPorId() en su lugar
   */
  obtenerLocalidadPorId = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // El parámetro ID ya fue validado por el middleware
        const parametrosValidados = { id: parseInt(req.params.id, 10) };

        // Validar query parameters si existen
        const filtrosValidados =
          Object.keys(req.query).length > 0
            ? ctLocalidadService.validarParametrosConsulta(req.query)
            : undefined;

        const localidad = await ctLocalidadService.obtenerLocalidadPorId(
          parametrosValidados,
          filtrosValidados
        );

        if (!localidad) {
          return enviarRespuestaNoEncontrado(res, "Localidad no encontrada");
        }

        enviarRespuestaExitosa(res, {
          datos: localidad,
          mensaje: "Localidad obtenida exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerLocalidadPorId (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Crear una nueva localidad (legacy)
   * @deprecated Usar crear() en su lugar
   */
  crearLocalidad = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const datos: CrearLocalidadInput = req.body;

        const nuevaLocalidad = await ctLocalidadService.crearLocalidad(datos);

        enviarRespuestaCreado(
          res,
          nuevaLocalidad,
          `Localidad "${nuevaLocalidad.localidad}" creada exitosamente`
        );
      } catch (error) {
        console.error("Error en crearLocalidad (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al crear localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Actualizar una localidad existente (legacy)
   * @deprecated Usar actualizar() en su lugar
   */
  actualizarLocalidad = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // El parámetro ID ya fue validado por el middleware
        const id = parseInt(req.params.id, 10);
        const datos: ActualizarLocalidadInput = req.body;

        const localidadActualizada = await ctLocalidadService.actualizarLocalidad(
          id,
          datos
        );

        enviarRespuestaExitosa(res, {
          datos: localidadActualizada,
          mensaje: `Localidad "${localidadActualizada.localidad}" actualizada exitosamente`,
        });
      } catch (error) {
        console.error("Error en actualizarLocalidad (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al actualizar localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Eliminar una localidad (legacy)
   * @deprecated Usar eliminar() en su lugar
   */
  eliminarLocalidad = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // El parámetro ID ya fue validado por el middleware
        const id = parseInt(req.params.id, 10);

        await ctLocalidadService.eliminarLocalidad(id);

        enviarRespuestaExitosa(res, {
          mensaje: "Localidad eliminada exitosamente",
        });
      } catch (error) {
        console.error("Error en eliminarLocalidad (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al eliminar localidad",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * @deprecated Usar obtenerTodos() en su lugar
   */
  obtenerTodasLasLocalidades = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const localidades = await ctLocalidadService.obtenerTodasLasLocalidades();

        enviarRespuestaExitosa(res, {
          datos: localidades,
          mensaje: "Localidades obtenidas exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerTodasLasLocalidades (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidades",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * @deprecated Usar obtenerPorId() con filtros
   */
  obtenerLocalidadCompleta = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // El parámetro ID ya fue validado por el middleware
        const id = parseInt(req.params.id, 10);

        const localidad = await ctLocalidadService.obtenerLocalidadCompleta(id);

        enviarRespuestaExitosa(res, {
          datos: localidad,
          mensaje: "Localidad completa obtenida exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerLocalidadCompleta (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidad completa",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * @deprecated Usar obtenerTodos() con filtro idMunicipio
   */
  obtenerLocalidadesPorMunicipio = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // El parámetro ID ya fue validado por el middleware
        const id = parseInt(req.params.id, 10);

        const localidades =
          await ctLocalidadService.obtenerLocalidadesPorMunicipio(id);

        enviarRespuestaExitosa(res, {
          datos: localidades,
          mensaje: `Se encontraron ${localidades.length} localidades en el municipio`,
        });
      } catch (error) {
        console.error("Error en obtenerLocalidadesPorMunicipio (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener localidades por municipio",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );
}

export default new CtLocalidadController();

/**
 * @example Ejemplos de uso de la API
 *
 * // Obtener todas las localidades
 * GET /api/localidades
 *
 * // Filtrar por municipio
 * GET /api/localidades?municipio=123
 *
 * // Buscar por nombre
 * GET /api/localidades?buscar=san jose
 *
 * // Incluir datos del municipio
 * GET /api/localidades?incluir_municipio=true
 *
 * // Obtener localidad específica
 * GET /api/localidades/456
 *
 * // Obtener localidad completa
 * GET /api/localidades/456/completa
 *
 * // Crear nueva localidad
 * POST /api/localidades
 * {
 *   "localidad": "San José de las Flores",
 *   "ambito": "R",
 *   "id_municipio": 123
 * }
 *
 * // Actualizar localidad
 * PUT /api/localidades/456
 * {
 *   "localidad": "San José de las Flores Centro"
 * }
 *
 * // Eliminar localidad
 * DELETE /api/localidades/456
 */

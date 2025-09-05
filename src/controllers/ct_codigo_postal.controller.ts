/**
 * @fileoverview Controlador de códigos postales
 * Implementa la interfaz IControladorCodigoPostal y usa el servicio tipado
 * Maneja todas las peticiones HTTP relacionadas con códigos postales
 */

import { Request, Response } from "express";
import ctCodigoPostalService from "../services/ct_codigo_postal.service";
import {
  enviarRespuestaExitosa,
  enviarRespuestaCreado,
  enviarRespuestaError,
  enviarRespuestaNoEncontrado,
  manejarErrorAsincrono,
} from "../utils/response.utils";
import { CodigosError } from "../types/response.types";
import { IControladorCodigoPostal } from "../interfaces/ct_codigo_postal.interface";
import {
  CrearCodigoPostalInput,
  ActualizarCodigoPostalInput,
  FiltrosCodigoPostalInput,
} from "../schemas/codigo_postal.schemas";

/**
 * Controlador de códigos postales que usa interfaces tipadas
 * Demuestra cómo usar interfaces sin implementar explícitamente
 */
class CtCodigoPostalController {
  /**
   * Obtener todos los códigos postales con filtros opcionales
   * GET /api/codigos-postales?codigoPostal=90210&pagina=1&limite=10
   */
  obtenerTodos = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        // Validar y construir filtros desde query parameters
        const filtros: FiltrosCodigoPostalInput = {};

        if (req.query.buscar) {
          filtros.buscar = req.query.buscar as string;
        }

        if (req.query.codigoPostal) {
          filtros.codigoPostal = req.query.codigoPostal as string;
        }

        if (req.query.asentamiento) {
          filtros.asentamiento = req.query.asentamiento as string;
        }

        if (req.query.idLocalidad) {
          filtros.idLocalidad = parseInt(req.query.idLocalidad as string);
        }

        if (req.query.pagina) {
          filtros.pagina = parseInt(req.query.pagina as string);
        }

        if (req.query.limite) {
          filtros.limite = parseInt(req.query.limite as string);
        }

        // Usar el servicio tipado
        const codigosPostales = await ctCodigoPostalService.obtenerTodos(filtros);

        enviarRespuestaExitosa(res, {
          datos: codigosPostales,
          mensaje: "Códigos postales obtenidos exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerTodos:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener códigos postales",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Obtener un código postal por ID
   * GET /api/codigos-postales/:id
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

        const codigoPostal = await ctCodigoPostalService.obtenerPorId(id);

        if (!codigoPostal) {
          return enviarRespuestaNoEncontrado(res, "Código postal no encontrado");
        }

        enviarRespuestaExitosa(res, {
          datos: codigoPostal,
          mensaje: "Código postal obtenido exitosamente",
        });
      } catch (error) {
        console.error("Error en obtenerPorId:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener código postal",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Crear un nuevo código postal
   * POST /api/codigos-postales
   * Body: { "codigoPostal": "90210", "asentamiento": "Centro", "idLocalidad": 123 }
   */
  crear = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const datos: CrearCodigoPostalInput = req.body;

        // Validaciones básicas ya manejadas por middleware de validación
        if (!datos.codigoPostal) {
          return enviarRespuestaError(res, {
            mensaje: "Datos de entrada inválidos",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El código postal es requerido",
          });
        }

        // Crear usando el servicio tipado
        const nuevoCodigoPostal = await ctCodigoPostalService.crear(datos);

        enviarRespuestaCreado(res, nuevoCodigoPostal, "Código postal creado exitosamente");
      } catch (error) {
        console.error("Error en crear:", error);

        // Manejar errores específicos de validación de negocio
        if (error instanceof Error && error.message.includes("no existe")) {
          return enviarRespuestaError(res, {
            mensaje: error.message,
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Localidad no encontrada",
          });
        }

        enviarRespuestaError(res, {
          mensaje: "Error al crear código postal",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Actualizar un código postal existente
   * PUT /api/codigos-postales/:id
   * Body: { "asentamiento": "Centro Histórico" }
   */
  actualizar = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const id = parseInt(req.params.id);
        const datos: ActualizarCodigoPostalInput = req.body;

        if (isNaN(id) || id <= 0) {
          return enviarRespuestaError(res, {
            mensaje: "ID inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El ID debe ser un número positivo",
          });
        }

        // Verificar que hay datos para actualizar
        if (!datos.codigoPostal && !datos.asentamiento && !datos.idLocalidad) {
          return enviarRespuestaError(res, {
            mensaje: "No hay datos para actualizar",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Debe proporcionar al menos un campo para actualizar",
          });
        }

        const codigoPostalActualizado = await ctCodigoPostalService.actualizar(id, datos);

        enviarRespuestaExitosa(res, {
          datos: codigoPostalActualizado,
          mensaje: "Código postal actualizado exitosamente",
        });
      } catch (error) {
        console.error("Error en actualizar:", error);

        if (error instanceof Error && error.message.includes("no encontrado")) {
          return enviarRespuestaNoEncontrado(res, "Código postal no encontrado");
        }

        if (error instanceof Error && error.message.includes("no existe")) {
          return enviarRespuestaError(res, {
            mensaje: error.message,
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Localidad no encontrada",
          });
        }

        enviarRespuestaError(res, {
          mensaje: "Error al actualizar código postal",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Eliminar un código postal
   * DELETE /api/codigos-postales/:id
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

        const eliminado = await ctCodigoPostalService.eliminar(id);

        if (!eliminado) {
          return enviarRespuestaNoEncontrado(res, "Código postal no encontrado");
        }

        enviarRespuestaExitosa(res, {
          datos: { eliminado: true },
          mensaje: "Código postal eliminado exitosamente",
        });
      } catch (error) {
        console.error("Error en eliminar:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al eliminar código postal",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Obtener información geográfica completa por código postal
   * GET /api/codigos-postales/:codigo/geografia
   */
  obtenerInformacionGeografica = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const codigoPostal = req.params.codigo;

        if (!codigoPostal || !/^\d{5}$/.test(codigoPostal)) {
          return enviarRespuestaError(res, {
            mensaje: "Código postal inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "El código postal debe ser de 5 dígitos numéricos",
          });
        }

        const informacionGeografica =
          await ctCodigoPostalService.obtenerInformacionGeograficaCompleta(
            codigoPostal
          );

        if (informacionGeografica.length === 0) {
          return enviarRespuestaNoEncontrado(
            res,
            `No se encontró información para el código postal ${codigoPostal}`
          );
        }

        // Crear resumen para el mensaje de respuesta
        const primerResultado = informacionGeografica[0];
        let ubicacion = codigoPostal;

        if (primerResultado.localidad?.municipio?.entidad) {
          ubicacion = `${primerResultado.localidad.municipio.entidad.nombre} > ${primerResultado.localidad.municipio.nombre} > ${primerResultado.localidad.nombre}`;
        }

        enviarRespuestaExitosa(res, {
          datos: informacionGeografica,
          mensaje: `Información geográfica obtenida para CP ${codigoPostal}: ${ubicacion} (${informacionGeografica.length} asentamientos)`,
        });
      } catch (error) {
        console.error("Error en obtenerInformacionGeografica:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener información geográfica",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  /**
   * Método adicional: Buscar códigos postales por código
   * GET /api/codigos-postales/buscar/:codigo
   */
  buscarPorCodigo = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const codigoPostal = req.params.codigo;

        if (!codigoPostal || codigoPostal.trim().length === 0) {
          return enviarRespuestaError(res, {
            mensaje: "Código postal de búsqueda inválido",
            codigoError: CodigosError.ERROR_VALIDACION,
            detalles: "Debe proporcionar un código postal válido para buscar",
          });
        }

        const codigosPostales = await ctCodigoPostalService.buscarPorCodigo(codigoPostal);

        enviarRespuestaExitosa(res, {
          datos: codigosPostales,
          mensaje: `Códigos postales encontrados para '${codigoPostal}'`,
        });
      } catch (error) {
        console.error("Error en buscarPorCodigo:", error);
        enviarRespuestaError(res, {
          mensaje: "Error al buscar códigos postales por código",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );

  // ==========================================
  // MÉTODOS LEGACY PARA COMPATIBILIDAD
  // ==========================================

  /**
   * Método legacy para compatibilidad con código existente
   * @deprecated Usar obtenerTodos() en su lugar
   */
  obtenerCodigosPostales = manejarErrorAsincrono(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const codigosPostales =
          await ctCodigoPostalService.obtenerCodigosPostales();

        enviarRespuestaExitosa(res, {
          datos: codigosPostales,
          mensaje: `Códigos postales obtenidos exitosamente (${codigosPostales.length} registros)`,
        });
      } catch (error) {
        console.error("Error en obtenerCodigosPostales (legacy):", error);
        enviarRespuestaError(res, {
          mensaje: "Error al obtener códigos postales",
          codigoError: CodigosError.ERROR_INTERNO_SERVIDOR,
          detalles:
            error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }
  );
}

export default new CtCodigoPostalController();

import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtUnidadService } from "../../services/infraestructura/ct_unidad.service";
import {
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput,
  crearCtUnidadSchema,
  actualizarCtUnidadSchema,
  ctUnidadIdParamSchema,
  CtUnidadIdParam,
} from "../../schemas/infraestructura/ct_unidad.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_UNIDAD =====
const ctUnidadService = new CtUnidadService();

export class CtUnidadController extends BaseController {
  /**
   * 🏫 Crear una nueva unidad de infraestructura
   * @route POST /api/infraestructura/unidad
   */
  crearUnidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        // Los datos ya están validados por el middleware validateRequest
        const unidadData: CrearCtUnidadInput = req.body;
        return await ctUnidadService.crearUnidad(unidadData);
      },
      "Unidad creada exitosamente"
    );
  };

  /**
   * 🏫 Obtener una unidad por ID
   * @route GET /api/infraestructura/unidad/:id_unidad
   */
  obtenerUnidadPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        // Validar parámetros usando BaseController
        const { id_unidad } = this.validarDatosConEsquema<CtUnidadIdParam>(
          ctUnidadIdParamSchema,
          req.params
        );

        return await ctUnidadService.obtenerUnidadPorId(id_unidad);
      },
      "Unidad obtenida exitosamente"
    );
  };

  /**
   * 🏫 Obtener todas las unidades con filtros y paginación
   * @route GET /api/infraestructura/unidad
   *
   * Query parameters soportados:
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - nombre_unidad: Filtrar por nombre (búsqueda parcial)
   * - municipio_cve: Filtrar por clave de municipio (ej: "051")
   * - id_localidad: Filtrar por ID de localidad
   * - id_sostenimiento: Filtrar por ID de sostenimiento
   * - id_tipo_escuela: Filtrar por ID de tipo de escuela
   * - vigente: Filtrar por estado vigente (0 o 1)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10, max: 1000)
   *
   * Ejemplos:
   * - GET /api/infraestructura/unidad?cct=29DPR
   * - GET /api/infraestructura/unidad?nombre_unidad=primaria&municipio_cve=051
   * - GET /api/infraestructura/unidad?vigente=1&pagina=2&limite=20
   */
  obtenerTodosLosCtUnidades = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        // Los filtros y paginación ya están validados por el middleware
        const filters: BuscarUnidadesInput = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctUnidadService.obtenerUnidades(filters, pagination);
      },
      "Unidades obtenidas exitosamente"
    );
  };

  /**
   * 🏫 Actualizar una unidad
   * @route PUT /api/infraestructura/unidad/:id_unidad
   */
  actualizarUnidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        // Validar parámetros usando BaseController
        const { id_unidad } = this.validarDatosConEsquema<CtUnidadIdParam>(
          ctUnidadIdParamSchema,
          req.params
        );
        const unidadData: ActualizarCtUnidadInput = req.body;

        return await ctUnidadService.actualizarUnidad(id_unidad, unidadData);
      },
      "Unidad actualizada exitosamente"
    );
  };

  /**
   * 🏫 Eliminar una unidad
   * @route DELETE /api/infraestructura/unidad/:id_unidad
   */
  eliminarUnidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        // Validar parámetros usando BaseController
        const { id_unidad } = this.validarDatosConEsquema<CtUnidadIdParam>(
          ctUnidadIdParamSchema,
          req.params
        );

        await ctUnidadService.eliminarUnidad(id_unidad);
      },
      "Unidad eliminada exitosamente"
    );
  };

  // ==========================================
  // NOTA: Todas las búsquedas se manejan con el método obtenerTodosLosCtUnidades
  // usando query parameters como filtros
  // ==========================================
}

import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtUnidadBaseService } from "../../services/infraestructura/ct_unidad_base.service";
import {
  CrearCtUnidadInput,
  ActualizarCtUnidadInput,
  BuscarUnidadesInput,
  ctUnidadIdParamSchema,
  CtUnidadIdParam,
} from "../../schemas/infraestructura/ct_unidad.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_UNIDAD CON BASE SERVICE =====
const ctUnidadBaseService = new CtUnidadBaseService();

export class CtUnidadBaseController extends BaseController {
  /**
   * 🏫 Crear una nueva unidad de infraestructura
   * @route POST /api/infraestructura/unidad
   */
  crearUnidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const unidadData: CrearCtUnidadInput = req.body;
        return await ctUnidadBaseService.crear(unidadData);
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
        const { id_unidad } = this.validarDatosConEsquema<CtUnidadIdParam>(
          ctUnidadIdParamSchema,
          req.params
        );

        return await ctUnidadBaseService.obtenerPorId(id_unidad);
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
   * - page: Número de página (default: 1)
   * - limit: Elementos por página (default: 10, max: 1000)
   */
  obtenerTodosLosCtUnidades = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters: BuscarUnidadesInput = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctUnidadBaseService.obtenerTodos(filters, pagination);
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
        const { id_unidad } = this.validarDatosConEsquema<CtUnidadIdParam>(
          ctUnidadIdParamSchema,
          req.params
        );
        const unidadData: ActualizarCtUnidadInput = req.body;

        return await ctUnidadBaseService.actualizar(id_unidad, unidadData);
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
        const { id_unidad } = this.validarDatosConEsquema<CtUnidadIdParam>(
          ctUnidadIdParamSchema,
          req.params
        );

        await ctUnidadBaseService.eliminar(id_unidad);
      },
      "Unidad eliminada exitosamente"
    );
  };

  // ==========================================
  // MÉTODOS ADICIONALES CON BASE SERVICE
  // ==========================================

  /**
   * 🔍 Obtener unidad por CCT
   * @route GET /api/infraestructura/unidad/cct/:cct
   */
  obtenerUnidadPorCCT = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { cct } = req.params;
        return await ctUnidadBaseService.obtenerPorCCT(cct);
      },
      "Unidad obtenida por CCT exitosamente"
    );
  };

  /**
   * 🗺️ Obtener unidades por municipio
   * @route GET /api/infraestructura/unidad/municipio/:cve_mun
   */
  obtenerUnidadesPorMunicipio = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { cve_mun } = req.params;
        return await ctUnidadBaseService.obtenerPorMunicipio({ cve_mun });
      },
      "Unidades del municipio obtenidas exitosamente"
    );
  };

  /**
   * 📝 Autocompletar unidades por nombre
   * @route GET /api/infraestructura/unidad/autocompletar?nombre=xxx&limite=10
   */
  autocompletarUnidades = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { nombre, limite } = req.query;
        const nombreStr = nombre as string;
        const limiteNum = limite ? parseInt(limite as string, 10) : 10;

        return await ctUnidadBaseService.buscarPorNombre(nombreStr, limiteNum);
      },
      "Búsqueda de unidades completada exitosamente"
    );
  };
}

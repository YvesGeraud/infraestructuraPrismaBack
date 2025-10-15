import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInfraestructuraEscuelaBaseService } from "../../services/infraestructura/ct_infraestructura_escuela.service";
import {
  CrearCtInfraestructuraEscuelaInput,
  ActualizarCtInfraestructuraEscuelaInput,
  ctInfraestructuraEscuelaIdParamSchema,
  CtInfraestructuraEscuelaIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_escuela.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_ESCUELA CON BASE SERVICE =====
const ctInfraestructuraEscuelaBaseService = new CtInfraestructuraEscuelaBaseService();

export class CtInfraestructuraEscuelaBaseController extends BaseController {
  /**
   * 📦 Crear nueva escuela
   * @route POST /api/ct_infraestructura_escuela
   */
  crearEscuela = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const escuelaData: CrearCtInfraestructuraEscuelaInput = req.body;
        return await ctInfraestructuraEscuelaBaseService.crear(escuelaData);
      },
      "Escuela creada exitosamente"
    );
  };

  /**
   * 📦 Obtener escuela por ID
   * @route GET /api/ct_infraestructura_escuela/:id_ct_infraestructura_escuela
   */
  obtenerEscuelaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_escuela } = this.validarDatosConEsquema<CtInfraestructuraEscuelaIdParam>(
          ctInfraestructuraEscuelaIdParamSchema,
          req.params
        );

        return await ctInfraestructuraEscuelaBaseService.obtenerPorId(id_ct_infraestructura_escuela);
      },
      "Escuela obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las escuelas con filtros y paginación
   * @route GET /api/ct_infraestructura_escuela
   *
   * Query parameters soportados:
   * - id_escuela_plantel: Filtrar por escuela plantel
   * - id_ct_tipo_escuela: Filtrar por tipo de escuela
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - id_ct_sostenimiento: Filtrar por sostenimiento
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - incluir_sostenimiento: Incluir datos del sostenimiento
   * - incluir_tipo_escuela: Incluir datos del tipo de escuela
   * - incluir_todas_relaciones: Incluir todas las relaciones
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasEscuelas = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        // Separar filtros de paginación
        const { pagina, limite, ...filters } = req.query as any;
        const pagination: PaginationInput = { pagina, limite };

        return await ctInfraestructuraEscuelaBaseService.obtenerTodos(filters, pagination);
      },
      "Escuelas obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar escuela
   * @route PUT /api/ct_infraestructura_escuela/:id_ct_infraestructura_escuela
   */
  actualizarEscuela = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_escuela } = this.validarDatosConEsquema<CtInfraestructuraEscuelaIdParam>(
          ctInfraestructuraEscuelaIdParamSchema,
          req.params
        );
        const escuelaData: ActualizarCtInfraestructuraEscuelaInput = req.body;

        return await ctInfraestructuraEscuelaBaseService.actualizar(id_ct_infraestructura_escuela, escuelaData);
      },
      "Escuela actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar escuela
   * @route DELETE /api/ct_infraestructura_escuela/:id_ct_infraestructura_escuela
   */
  eliminarEscuela = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_escuela } = this.validarDatosConEsquema<CtInfraestructuraEscuelaIdParam>(
          ctInfraestructuraEscuelaIdParamSchema,
          req.params
        );

        await ctInfraestructuraEscuelaBaseService.eliminar(id_ct_infraestructura_escuela);
      },
      "Escuela eliminada exitosamente"
    );
  };
}

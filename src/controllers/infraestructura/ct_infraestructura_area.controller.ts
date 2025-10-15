import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInfraestructuraAreaBaseService } from "../../services/infraestructura/ct_infraestructura_area.service";
import {
  CrearCtInfraestructuraAreaInput,
  ActualizarCtInfraestructuraAreaInput,
  ctInfraestructuraAreaIdParamSchema,
  CtInfraestructuraAreaIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_area.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_AREA CON BASE SERVICE =====
const ctInfraestructuraAreaBaseService = new CtInfraestructuraAreaBaseService();

export class CtInfraestructuraAreaBaseController extends BaseController {
  /**
   * 📦 Crear nueva área
   * @route POST /api/ct_infraestructura_area
   */
  crearArea = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const areaData: CrearCtInfraestructuraAreaInput = req.body;
        return await ctInfraestructuraAreaBaseService.crear(areaData);
      },
      "Área creada exitosamente"
    );
  };

  /**
   * 📦 Obtener área por ID
   * @route GET /api/ct_infraestructura_area/:id_ct_infraestructura_area
   */
  obtenerAreaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_area } = this.validarDatosConEsquema<CtInfraestructuraAreaIdParam>(
          ctInfraestructuraAreaIdParamSchema,
          req.params
        );

        return await ctInfraestructuraAreaBaseService.obtenerPorId(id_ct_infraestructura_area);
      },
      "Área obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las áreas con filtros y paginación
   * @route GET /api/ct_infraestructura_area
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasAreas = async (
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

        return await ctInfraestructuraAreaBaseService.obtenerTodos(filters, pagination);
      },
      "Áreas obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar área
   * @route PUT /api/ct_infraestructura_area/:id_ct_infraestructura_area
   */
  actualizarArea = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_area } = this.validarDatosConEsquema<CtInfraestructuraAreaIdParam>(
          ctInfraestructuraAreaIdParamSchema,
          req.params
        );
        const areaData: ActualizarCtInfraestructuraAreaInput = req.body;

        return await ctInfraestructuraAreaBaseService.actualizar(id_ct_infraestructura_area, areaData);
      },
      "Área actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar área
   * @route DELETE /api/ct_infraestructura_area/:id_ct_infraestructura_area
   */
  eliminarArea = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_area } = this.validarDatosConEsquema<CtInfraestructuraAreaIdParam>(
          ctInfraestructuraAreaIdParamSchema,
          req.params
        );

        await ctInfraestructuraAreaBaseService.eliminar(id_ct_infraestructura_area);
      },
      "Área eliminada exitosamente"
    );
  };
}

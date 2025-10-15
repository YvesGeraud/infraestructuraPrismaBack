import { Request, Response } from "express";
import { BaseController } from "../BaseController";
    import { CtInventarioAltaBaseService } from "../../services/inventario/ct_inventario_alta.service";
import {
  CrearCtInventarioAltaInput,
  ActualizarCtInventarioAltaInput,
  ctInventarioAltaIdParamSchema,
  CtInventarioAltaIdParam,
} from "../../schemas/inventario/ct_inventario_alta.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ENTIDAD CON BASE SERVICE =====
    const ctInventarioAltaBaseService = new CtInventarioAltaBaseService();

export class CtInventarioAltaBaseController extends BaseController {
  /**
   * 📦 Crear nueva entidad
   * @route POST /api/inventario/marca
   */
  crearInventarioAlta = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const entidadData: CrearCtInventarioAltaInput = req.body;
        return await ctInventarioAltaBaseService.crear(entidadData);
      },
        "Entidad creada exitosamente"
    );
  };

  /**
   * 📦 Obtener entidad por ID
   * @route GET /api/inventario/entidad/:id_entidad
   */
  obtenerInventarioAltaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_alta } = this.validarDatosConEsquema<CtInventarioAltaIdParam>(
          ctInventarioAltaIdParamSchema,
          req.params
        );

            return await ctInventarioAltaBaseService.obtenerPorId(id_ct_inventario_alta);
      },
      "Inventario alta obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las inventario alta con filtros y paginación
   * @route GET /api/inventario/inventario_alta
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioAlta = async (
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

        return await ctInventarioAltaBaseService.obtenerTodos(filters, pagination);
      },
      "Inventario alta obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar inventario alta
   * @route PUT /api/inventario/marca/:id_marca
   */
  actualizarInventarioAlta = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
            const { id_ct_inventario_alta } = this.validarDatosConEsquema<CtInventarioAltaIdParam>(
          ctInventarioAltaIdParamSchema,
          req.params
        );
        const entidadData: ActualizarCtInventarioAltaInput = req.body;

        return await ctInventarioAltaBaseService.actualizar(id_ct_inventario_alta, entidadData);
      },
      "Inventario alta actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar inventario alta
   * @route DELETE /api/inventario/marca/:id_marca
   */
  eliminarInventarioAlta = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_alta } = this.validarDatosConEsquema<CtInventarioAltaIdParam>(
            ctInventarioAltaIdParamSchema,
          req.params
        );

        await ctInventarioAltaBaseService.eliminar(id_ct_inventario_alta);
      },
      "Inventario alta eliminada exitosamente"
    );
  };
}

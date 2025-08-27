import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtMarcaBaseService } from "../../services/inventario/ct_marca_base.service";
import {
  CrearCtMarcaInput,
  ActualizarCtMarcaInput,
  ctMarcaIdParamSchema,
  CtMarcaIdParam,
} from "../../schemas/inventario/ct_marca.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_MARCA CON BASE SERVICE =====
const ctMarcaBaseService = new CtMarcaBaseService();

export class CtMarcaBaseController extends BaseController {
  /**
   * 📦 Crear nueva marca
   * @route POST /api/inventario/marca
   */
  crearMarca = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const marcaData: CrearCtMarcaInput = req.body;
        return await ctMarcaBaseService.crear(marcaData);
      },
      "Marca creada exitosamente"
    );
  };

  /**
   * 📦 Obtener marca por ID
   * @route GET /api/inventario/marca/:id_marca
   */
  obtenerMarcaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_marca } = this.validarDatosConEsquema<CtMarcaIdParam>(
          ctMarcaIdParamSchema,
          req.params
        );

        return await ctMarcaBaseService.obtenerPorId(id_marca);
      },
      "Marca obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las marcas con filtros y paginación
   * @route GET /api/inventario/marca
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - page: Número de página (default: 1)
   * - limit: Elementos por página (default: 10)
   */
  obtenerTodasLasMarcas = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctMarcaBaseService.obtenerTodos(filters, pagination);
      },
      "Marcas obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar marca
   * @route PUT /api/inventario/marca/:id_marca
   */
  actualizarMarca = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_marca } = this.validarDatosConEsquema<CtMarcaIdParam>(
          ctMarcaIdParamSchema,
          req.params
        );
        const marcaData: ActualizarCtMarcaInput = req.body;

        return await ctMarcaBaseService.actualizar(id_marca, marcaData);
      },
      "Marca actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar marca
   * @route DELETE /api/inventario/marca/:id_marca
   */
  eliminarMarca = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_marca } = this.validarDatosConEsquema<CtMarcaIdParam>(
          ctMarcaIdParamSchema,
          req.params
        );

        await ctMarcaBaseService.eliminar(id_marca);
      },
      "Marca eliminada exitosamente"
    );
  };
}

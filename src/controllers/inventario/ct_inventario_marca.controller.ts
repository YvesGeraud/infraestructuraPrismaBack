import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioMarcaBaseService } from "../../services/inventario/ct_inventario_marca.service";
import {
  CrearCtInventarioMarcaInput,
  ActualizarCtInventarioMarcaInput,
  ctInventarioMarcaIdParamSchema,
  CtInventarioMarcaIdParam,
} from "../../schemas/inventario/ct_inventario_marca.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_MARCA CON BASE SERVICE =====
const ctInventarioMarcaBaseService = new CtInventarioMarcaBaseService();

export class CtInventarioMarcaBaseController extends BaseController {
  /**
   * 📦 Crear nueva marca
   * @route POST /api/ct_inventario_marca
   */
  crearInventarioMarca = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioMarcaData: CrearCtInventarioMarcaInput = req.body;
        return await ctInventarioMarcaBaseService.crear(inventarioMarcaData);
      },
      "Marca creada exitosamente"
    );
  };

  /**
   * 📦 Obtener marca por ID
   * @route GET /api/ct_inventario_marca/:id_ct_inventario_material
   */
  obtenerInventarioMarcaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_material } = this.validarDatosConEsquema<CtInventarioMarcaIdParam>(
          ctInventarioMarcaIdParamSchema,
          req.params
        );

        return await ctInventarioMarcaBaseService.obtenerPorId(id_ct_inventario_material);
      },
      "Marca obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las marcas con filtros y paginación
   * @route GET /api/ct_inventario_marca
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioMarcas = async (
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

        return await ctInventarioMarcaBaseService.obtenerTodos(filters, pagination);
      },
      "Marcas obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar marca
   * @route PUT /api/ct_inventario_marca/:id_ct_inventario_material
   */
  actualizarInventarioMarca = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_material } = this.validarDatosConEsquema<CtInventarioMarcaIdParam>(
          ctInventarioMarcaIdParamSchema,
          req.params
        );
        const inventarioMarcaData: ActualizarCtInventarioMarcaInput = req.body;

        return await ctInventarioMarcaBaseService.actualizar(id_ct_inventario_material, inventarioMarcaData);
      },
      "Marca actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar marca
   * @route DELETE /api/ct_inventario_marca/:id_ct_inventario_material
   */
  eliminarInventarioMarca = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_material } = this.validarDatosConEsquema<CtInventarioMarcaIdParam>(
          ctInventarioMarcaIdParamSchema,
          req.params
        );

        await ctInventarioMarcaBaseService.eliminar(id_ct_inventario_material);
      },
      "Marca eliminada exitosamente"
    );
  };
}

import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioTipoArticuloBaseService } from "../../services/inventario/ct_inventario_tipo_articulo.service";
import {
  CrearCtInventarioTipoArticuloInput,
  ActualizarCtInventarioTipoArticuloInput,
  ctInventarioTipoArticuloIdParamSchema,
  CtInventarioTipoArticuloIdParam,
} from "../../schemas/inventario/ct_inventario_tipo_articulo.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_TIPO_ARTICULO CON BASE SERVICE =====
const ctInventarioTipoArticuloBaseService = new CtInventarioTipoArticuloBaseService();

export class CtInventarioTipoArticuloBaseController extends BaseController {
  /**
   * 📦 Crear nuevo tipo de artículo
   * @route POST /api/ct_inventario_tipo_articulo
   */
  crearInventarioTipoArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioTipoArticuloData: CrearCtInventarioTipoArticuloInput = req.body;
        return await ctInventarioTipoArticuloBaseService.crear(inventarioTipoArticuloData);
      },
      "Tipo de artículo creado exitosamente"
    );
  };

  /**
   * 📦 Obtener tipo de artículo por ID
   * @route GET /api/ct_inventario_tipo_articulo/:id_ct_inventario_tipo_articulo
   */
  obtenerInventarioTipoArticuloPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_tipo_articulo } = this.validarDatosConEsquema<CtInventarioTipoArticuloIdParam>(
          ctInventarioTipoArticuloIdParamSchema,
          req.params
        );

        return await ctInventarioTipoArticuloBaseService.obtenerPorId(id_ct_inventario_tipo_articulo);
      },
      "Tipo de artículo obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los tipos de artículo con filtros y paginación
   * @route GET /api/ct_inventario_tipo_articulo
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosInventarioTipoArticulos = async (
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

        return await ctInventarioTipoArticuloBaseService.obtenerTodos(filters, pagination);
      },
      "Tipos de artículo obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar tipo de artículo
   * @route PUT /api/ct_inventario_tipo_articulo/:id_ct_inventario_tipo_articulo
   */
  actualizarInventarioTipoArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_tipo_articulo } = this.validarDatosConEsquema<CtInventarioTipoArticuloIdParam>(
          ctInventarioTipoArticuloIdParamSchema,
          req.params
        );
        const inventarioTipoArticuloData: ActualizarCtInventarioTipoArticuloInput = req.body;

        return await ctInventarioTipoArticuloBaseService.actualizar(id_ct_inventario_tipo_articulo, inventarioTipoArticuloData);
      },
      "Tipo de artículo actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar tipo de artículo
   * @route DELETE /api/ct_inventario_tipo_articulo/:id_ct_inventario_tipo_articulo
   */
  eliminarInventarioTipoArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_tipo_articulo } = this.validarDatosConEsquema<CtInventarioTipoArticuloIdParam>(
          ctInventarioTipoArticuloIdParamSchema,
          req.params
        );

        await ctInventarioTipoArticuloBaseService.eliminar(id_ct_inventario_tipo_articulo);
      },
      "Tipo de artículo eliminado exitosamente"
    );
  };
}

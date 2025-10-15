import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { DtInventarioArticuloBaseService } from "../../services/inventario/dt_inventario_articulo.service";
import {
  CrearDtInventarioArticuloInput,
  ActualizarDtInventarioArticuloInput,
  dtInventarioArticuloIdParamSchema,
  DtInventarioArticuloIdParam,
} from "../../schemas/inventario/dt_inventario_articulo.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA DT_INVENTARIO_ARTICULO CON BASE SERVICE =====
const dtInventarioArticuloBaseService = new DtInventarioArticuloBaseService();

export class DtInventarioArticuloBaseController extends BaseController {
  /**
   * 📦 Crear nuevo artículo de inventario
   * @route POST /api/dt_inventario_articulo
   */
  crearInventarioArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioArticuloData: CrearDtInventarioArticuloInput = req.body;
        return await dtInventarioArticuloBaseService.crear(inventarioArticuloData);
      },
      "Artículo de inventario creado exitosamente"
    );
  };

  /**
   * 📦 Obtener artículo de inventario por ID
   * @route GET /api/dt_inventario_articulo/:id_dt_inventario_articulo
   */
  obtenerInventarioArticuloPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_dt_inventario_articulo } = this.validarDatosConEsquema<DtInventarioArticuloIdParam>(
          dtInventarioArticuloIdParamSchema,
          req.params
        );

        return await dtInventarioArticuloBaseService.obtenerPorId(id_dt_inventario_articulo);
      },
      "Artículo de inventario obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los artículos de inventario con filtros y paginación
   * @route GET /api/dt_inventario_articulo
   *
   * Query parameters soportados:
   * - folio: Filtrar por folio (búsqueda parcial)
   * - folio_antiguo: Filtrar por folio antiguo (búsqueda parcial)
   * - no_serie: Filtrar por número de serie
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_ct_inventario_subclase: Filtrar por subclase
   * - id_ct_inventario_material: Filtrar por material
   * - id_ct_inventario_marca: Filtrar por marca
   * - id_ct_inventario_color: Filtrar por color
   * - id_ct_inventario_proveedor: Filtrar por proveedor
   * - id_ct_inventario_estado_fisico: Filtrar por estado físico
   * - id_ct_inventario_tipo_articulo: Filtrar por tipo de artículo
   * - id_rl_infraestructura_jerarquia: Filtrar por jerarquía
   * - incluir_color: Incluir datos del color
   * - incluir_estado_fisico: Incluir datos del estado físico
   * - incluir_marca: Incluir datos de la marca
   * - incluir_material: Incluir datos del material
   * - incluir_proveedor: Incluir datos del proveedor
   * - incluir_subclase: Incluir datos de la subclase
   * - incluir_tipo_articulo: Incluir datos del tipo de artículo
   * - incluir_jerarquia: Incluir datos de la jerarquía
   * - incluir_todas_relaciones: Incluir todas las relaciones
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosInventarioArticulos = async (
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

        return await dtInventarioArticuloBaseService.obtenerTodos(filters, pagination);
      },
      "Artículos de inventario obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar artículo de inventario
   * @route PUT /api/dt_inventario_articulo/:id_dt_inventario_articulo
   */
  actualizarInventarioArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_dt_inventario_articulo } = this.validarDatosConEsquema<DtInventarioArticuloIdParam>(
          dtInventarioArticuloIdParamSchema,
          req.params
        );
        const inventarioArticuloData: ActualizarDtInventarioArticuloInput = req.body;

        return await dtInventarioArticuloBaseService.actualizar(id_dt_inventario_articulo, inventarioArticuloData);
      },
      "Artículo de inventario actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar artículo de inventario
   * @route DELETE /api/dt_inventario_articulo/:id_dt_inventario_articulo
   */
  eliminarInventarioArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_dt_inventario_articulo } = this.validarDatosConEsquema<DtInventarioArticuloIdParam>(
          dtInventarioArticuloIdParamSchema,
          req.params
        );

        await dtInventarioArticuloBaseService.eliminar(id_dt_inventario_articulo);
      },
      "Artículo de inventario eliminado exitosamente"
    );
  };
}

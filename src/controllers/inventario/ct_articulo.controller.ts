import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtArticuloBaseService } from "../../services/inventario/ct_articulo.service";
import {
  CrearCtArticuloInput,
  ActualizarCtArticuloInput,
  ctArticuloIdParamSchema,
  CtArticuloIdParam,
} from "../../schemas/inventario/ct_articulo.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ARTICULO CON BASE SERVICE =====
const ctArticuloBaseService = new CtArticuloBaseService();

export class CtArticuloBaseController extends BaseController {
  /**
   * 📦 Crear nuevo artículo
   * @route POST /api/inventario/articulo
   */
  crearArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const articuloData: CrearCtArticuloInput = req.body;
        return await ctArticuloBaseService.crear(articuloData);
      },
      "Artículo creado exitosamente"
    );
  };

  /**
   * 📦 Obtener artículo por ID
   * @route GET /api/inventario/articulo/:id_articulo
   */
  obtenerArticuloPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_articulo } = this.validarDatosConEsquema<CtArticuloIdParam>(
          ctArticuloIdParamSchema,
          req.params
        );

        return await ctArticuloBaseService.obtenerPorId(id_articulo);
      },
      "Artículo obtenido exitosamente"
    );
  };

  obtenerTodosLosArticulos = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctArticuloBaseService.obtenerTodos(filters, pagination);
      },
      "Artículos obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar artículo
   * @route PUT /api/inventario/articulo/:id_articulo
   */
  actualizarArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_articulo } = this.validarDatosConEsquema<CtArticuloIdParam>(
          ctArticuloIdParamSchema,
          req.params
        );
        const articuloData: ActualizarCtArticuloInput = req.body;

        return await ctArticuloBaseService.actualizar(
          id_articulo,
          articuloData
        );
      },
      "Artículo actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar artículo
   * @route DELETE /api/inventario/articulo/:id_articulo
   */
  eliminarArticulo = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_articulo } = this.validarDatosConEsquema<CtArticuloIdParam>(
          ctArticuloIdParamSchema,
          req.params
        );

        await ctArticuloBaseService.eliminar(id_articulo);
      },
      "Artículo eliminado exitosamente"
    );
  };
}

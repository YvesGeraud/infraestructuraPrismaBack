import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioColorBaseService } from "../../services/inventario/ct_inventario_color.service";
import {
  CrearCtInventarioColorInput,
  ActualizarCtInventarioColorInput,
  ctInventarioColorIdParamSchema,
  CtInventarioColorIdParam,
} from "../../schemas/inventario/ct_inventario_color.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_COLOR CON BASE SERVICE =====
const ctInventarioColorBaseService = new CtInventarioColorBaseService();

export class CtInventarioColorBaseController extends BaseController {
  /**
   * 📦 Crear nuevo color de inventario
   * @route POST /api/ct_inventario_color
   */
  crearInventarioColor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioColorData: CrearCtInventarioColorInput = req.body;
        return await ctInventarioColorBaseService.crear(inventarioColorData);
      },
      "Color de inventario creado exitosamente"
    );
  };

  /**
   * 📦 Obtener color de inventario por ID
   * @route GET /api/ct_inventario_color/:id_ct_inventario_color
   */
  obtenerInventarioColorPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_color } = this.validarDatosConEsquema<CtInventarioColorIdParam>(
          ctInventarioColorIdParamSchema,
          req.params
        );

        return await ctInventarioColorBaseService.obtenerPorId(id_ct_inventario_color);
      },
      "Color de inventario obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los colores de inventario con filtros y paginación
   * @route GET /api/ct_inventario_color
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosInventarioColores = async (
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

        return await ctInventarioColorBaseService.obtenerTodos(filters, pagination);
      },
      "Colores de inventario obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar color de inventario
   * @route PUT /api/ct_inventario_color/:id_ct_inventario_color
   */
  actualizarInventarioColor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_color } = this.validarDatosConEsquema<CtInventarioColorIdParam>(
          ctInventarioColorIdParamSchema,
          req.params
        );
        const inventarioColorData: ActualizarCtInventarioColorInput = req.body;

        return await ctInventarioColorBaseService.actualizar(id_ct_inventario_color, inventarioColorData);
      },
      "Color de inventario actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar color de inventario
   * @route DELETE /api/ct_inventario_color/:id_ct_inventario_color
   */
  eliminarInventarioColor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_color } = this.validarDatosConEsquema<CtInventarioColorIdParam>(
          ctInventarioColorIdParamSchema,
          req.params
        );

        await ctInventarioColorBaseService.eliminar(id_ct_inventario_color);
      },
      "Color de inventario eliminado exitosamente"
    );
  };
}

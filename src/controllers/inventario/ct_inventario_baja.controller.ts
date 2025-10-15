import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioBajaBaseService } from "../../services/inventario/ct_inventario_baja.service";
import {
  CrearCtInventarioBajaInput,
  ActualizarCtInventarioBajaInput,
  ctInventarioBajaIdParamSchema,
  CtInventarioBajaIdParam,
} from "../../schemas/inventario/ct_inventario_baja.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_BAJA CON BASE SERVICE =====
const ctInventarioBajaBaseService = new CtInventarioBajaBaseService();

export class CtInventarioBajaBaseController extends BaseController {
  /**
   * 📦 Crear nueva causa de baja
   * @route POST /api/ct_inventario_baja
   */
  crearInventarioBaja = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioBajaData: CrearCtInventarioBajaInput = req.body;
        return await ctInventarioBajaBaseService.crear(inventarioBajaData);
      },
      "Causa de baja creada exitosamente"
    );
  };

  /**
   * 📦 Obtener causa de baja por ID
   * @route GET /api/ct_inventario_baja/:id_ct_inventario_baja
   */
  obtenerInventarioBajaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_baja } = this.validarDatosConEsquema<CtInventarioBajaIdParam>(
          ctInventarioBajaIdParamSchema,
          req.params
        );

        return await ctInventarioBajaBaseService.obtenerPorId(id_ct_inventario_baja);
      },
      "Causa de baja obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las causas de baja con filtros y paginación
   * @route GET /api/ct_inventario_baja
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioBajas = async (
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

        return await ctInventarioBajaBaseService.obtenerTodos(filters, pagination);
      },
      "Causas de baja obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar causa de baja
   * @route PUT /api/ct_inventario_baja/:id_ct_inventario_baja
   */
  actualizarInventarioBaja = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_baja } = this.validarDatosConEsquema<CtInventarioBajaIdParam>(
          ctInventarioBajaIdParamSchema,
          req.params
        );
        const inventarioBajaData: ActualizarCtInventarioBajaInput = req.body;

        return await ctInventarioBajaBaseService.actualizar(id_ct_inventario_baja, inventarioBajaData);
      },
      "Causa de baja actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar causa de baja
   * @route DELETE /api/ct_inventario_baja/:id_ct_inventario_baja
   */
  eliminarInventarioBaja = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_baja } = this.validarDatosConEsquema<CtInventarioBajaIdParam>(
          ctInventarioBajaIdParamSchema,
          req.params
        );

        await ctInventarioBajaBaseService.eliminar(id_ct_inventario_baja);
      },
      "Causa de baja eliminada exitosamente"
    );
  };
}

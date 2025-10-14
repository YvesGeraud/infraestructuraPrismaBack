import { Request, Response } from "express";
import { BaseController } from "./BaseController";
    import { CtBitacoraAccionBaseService } from "../services/ct_bitacora_accion.service";
import {
  CrearCtBitacoraAccionInput,
  ActualizarCtBitacoraAccionInput,
  ctBitacoraAccionIdParamSchema,
  CtBitacoraAccionIdParam,
} from "../schemas/ct_bitacora_accion.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ENTIDAD CON BASE SERVICE =====
    const ctBitacoraAccionBaseService = new CtBitacoraAccionBaseService();

export class CtBitacoraAccionBaseController extends BaseController {
  /**
   * 📦 Crear nueva entidad
   * @route POST /api/inventario/marca
   */
  crearAccion = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const entidadData: CrearCtBitacoraAccionInput = req.body;
        return await ctBitacoraAccionBaseService.crear(entidadData);
      },
        "Accion creada exitosamente"
    );
  };

  /**
   * 📦 Obtener accion por ID
   * @route GET /api/inventario/accion/:id_accion
   */
  obtenerAccionPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_bitacora_accion } = this.validarDatosConEsquema<CtBitacoraAccionIdParam>(
          ctBitacoraAccionIdParamSchema,
          req.params
        );

            return await ctBitacoraAccionBaseService.obtenerPorId(id_ct_bitacora_accion);
      },
      "Accion obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las acciones con filtros y paginación
   * @route GET /api/inventario/accion
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasAcciones = async (
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

        return await ctBitacoraAccionBaseService.obtenerTodos(filters, pagination);
      },
      "Acciones obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar entidad
   * @route PUT /api/inventario/marca/:id_marca
   */
  actualizarAccion = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
            const { id_ct_bitacora_accion } = this.validarDatosConEsquema<CtBitacoraAccionIdParam>(
          ctBitacoraAccionIdParamSchema,
          req.params
        );
        const accionData: ActualizarCtBitacoraAccionInput = req.body;

        return await ctBitacoraAccionBaseService.actualizar(id_ct_bitacora_accion, accionData);
      },
      "Accion actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar entidad
   * @route DELETE /api/inventario/marca/:id_marca
   */
  eliminarAccion = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_bitacora_accion } = this.validarDatosConEsquema<CtBitacoraAccionIdParam>(
            ctBitacoraAccionIdParamSchema,
          req.params
        );

        await ctBitacoraAccionBaseService.eliminar(id_ct_bitacora_accion);
      },
      "Accion eliminada exitosamente"
    );
  };
}

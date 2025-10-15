import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioSubclaseBaseService } from "../../services/inventario/ct_inventario_subclase.service";
import {
  CrearCtInventarioSubclaseInput,
  ActualizarCtInventarioSubclaseInput,
  ctInventarioSubclaseIdParamSchema,
  CtInventarioSubclaseIdParam,
} from "../../schemas/inventario/ct_inventario_subclase.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_SUBCLASE CON BASE SERVICE =====
const ctInventarioSubclaseBaseService = new CtInventarioSubclaseBaseService();

export class CtInventarioSubclaseBaseController extends BaseController {
  /**
   * 📦 Crear nueva subclase
   * @route POST /api/ct_inventario_subclase
   */
  crearInventarioSubclase = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioSubclaseData: CrearCtInventarioSubclaseInput = req.body;
        return await ctInventarioSubclaseBaseService.crear(inventarioSubclaseData);
      },
      "Subclase creada exitosamente"
    );
  };

  /**
   * 📦 Obtener subclase por ID
   * @route GET /api/ct_inventario_subclase/:id_ct_inventario_subclase
   */
  obtenerInventarioSubclasePorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_subclase } = this.validarDatosConEsquema<CtInventarioSubclaseIdParam>(
          ctInventarioSubclaseIdParamSchema,
          req.params
        );

        return await ctInventarioSubclaseBaseService.obtenerPorId(id_ct_inventario_subclase);
      },
      "Subclase obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las subclases con filtros y paginación
   * @route GET /api/ct_inventario_subclase
   *
   * Query parameters soportados:
   * - id_ct_inventario_clase: Filtrar por clase padre
   * - no_subclase: Filtrar por número de subclase
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - incluir_clase: Incluir datos de la clase padre
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioSubclases = async (
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

        return await ctInventarioSubclaseBaseService.obtenerTodos(filters, pagination);
      },
      "Subclases obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar subclase
   * @route PUT /api/ct_inventario_subclase/:id_ct_inventario_subclase
   */
  actualizarInventarioSubclase = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_subclase } = this.validarDatosConEsquema<CtInventarioSubclaseIdParam>(
          ctInventarioSubclaseIdParamSchema,
          req.params
        );
        const inventarioSubclaseData: ActualizarCtInventarioSubclaseInput = req.body;

        return await ctInventarioSubclaseBaseService.actualizar(id_ct_inventario_subclase, inventarioSubclaseData);
      },
      "Subclase actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar subclase
   * @route DELETE /api/ct_inventario_subclase/:id_ct_inventario_subclase
   */
  eliminarInventarioSubclase = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_subclase } = this.validarDatosConEsquema<CtInventarioSubclaseIdParam>(
          ctInventarioSubclaseIdParamSchema,
          req.params
        );

        await ctInventarioSubclaseBaseService.eliminar(id_ct_inventario_subclase);
      },
      "Subclase eliminada exitosamente"
    );
  };
}

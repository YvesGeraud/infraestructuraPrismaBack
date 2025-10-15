import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioProveedorBaseService } from "../../services/inventario/ct_inventario_proveedor.service";
import {
  CrearCtInventarioProveedorInput,
  ActualizarCtInventarioProveedorInput,
  ctInventarioProveedorIdParamSchema,
  CtInventarioProveedorIdParam,
} from "../../schemas/inventario/ct_inventario_proveedor.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_PROVEEDOR CON BASE SERVICE =====
const ctInventarioProveedorBaseService = new CtInventarioProveedorBaseService();

export class CtInventarioProveedorBaseController extends BaseController {
  /**
   * 📦 Crear nuevo proveedor
   * @route POST /api/ct_inventario_proveedor
   */
  crearInventarioProveedor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioProveedorData: CrearCtInventarioProveedorInput = req.body;
        return await ctInventarioProveedorBaseService.crear(inventarioProveedorData);
      },
      "Proveedor creado exitosamente"
    );
  };

  /**
   * 📦 Obtener proveedor por ID
   * @route GET /api/ct_inventario_proveedor/:id_ct_inventario_proveedor
   */
  obtenerInventarioProveedorPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_proveedor } = this.validarDatosConEsquema<CtInventarioProveedorIdParam>(
          ctInventarioProveedorIdParamSchema,
          req.params
        );

        return await ctInventarioProveedorBaseService.obtenerPorId(id_ct_inventario_proveedor);
      },
      "Proveedor obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los proveedores con filtros y paginación
   * @route GET /api/ct_inventario_proveedor
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosInventarioProveedores = async (
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

        return await ctInventarioProveedorBaseService.obtenerTodos(filters, pagination);
      },
      "Proveedores obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar proveedor
   * @route PUT /api/ct_inventario_proveedor/:id_ct_inventario_proveedor
   */
  actualizarInventarioProveedor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_proveedor } = this.validarDatosConEsquema<CtInventarioProveedorIdParam>(
          ctInventarioProveedorIdParamSchema,
          req.params
        );
        const inventarioProveedorData: ActualizarCtInventarioProveedorInput = req.body;

        return await ctInventarioProveedorBaseService.actualizar(id_ct_inventario_proveedor, inventarioProveedorData);
      },
      "Proveedor actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar proveedor
   * @route DELETE /api/ct_inventario_proveedor/:id_ct_inventario_proveedor
   */
  eliminarInventarioProveedor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_proveedor } = this.validarDatosConEsquema<CtInventarioProveedorIdParam>(
          ctInventarioProveedorIdParamSchema,
          req.params
        );

        await ctInventarioProveedorBaseService.eliminar(id_ct_inventario_proveedor);
      },
      "Proveedor eliminado exitosamente"
    );
  };
}

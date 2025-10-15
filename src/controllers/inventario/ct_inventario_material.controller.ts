import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInventarioMaterialBaseService } from "../../services/inventario/ct_inventario_material.service";
import {
  CrearCtInventarioMaterialInput,
  ActualizarCtInventarioMaterialInput,
  ctInventarioMaterialIdParamSchema,
  CtInventarioMaterialIdParam,
} from "../../schemas/inventario/ct_inventario_material.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_MATERIAL CON BASE SERVICE =====
const ctInventarioMaterialBaseService = new CtInventarioMaterialBaseService();

export class CtInventarioMaterialBaseController extends BaseController {
  /**
   * 📦 Crear nuevo material
   * @route POST /api/ct_inventario_material
   */
  crearInventarioMaterial = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const inventarioMaterialData: CrearCtInventarioMaterialInput = req.body;
        return await ctInventarioMaterialBaseService.crear(inventarioMaterialData);
      },
      "Material creado exitosamente"
    );
  };

  /**
   * 📦 Obtener material por ID
   * @route GET /api/ct_inventario_material/:id_ct_inventario_marca
   */
  obtenerInventarioMaterialPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_marca } = this.validarDatosConEsquema<CtInventarioMaterialIdParam>(
          ctInventarioMaterialIdParamSchema,
          req.params
        );

        return await ctInventarioMaterialBaseService.obtenerPorId(id_ct_inventario_marca);
      },
      "Material obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los materiales con filtros y paginación
   * @route GET /api/ct_inventario_material
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosInventarioMateriales = async (
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

        return await ctInventarioMaterialBaseService.obtenerTodos(filters, pagination);
      },
      "Materiales obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar material
   * @route PUT /api/ct_inventario_material/:id_ct_inventario_marca
   */
  actualizarInventarioMaterial = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_marca } = this.validarDatosConEsquema<CtInventarioMaterialIdParam>(
          ctInventarioMaterialIdParamSchema,
          req.params
        );
        const inventarioMaterialData: ActualizarCtInventarioMaterialInput = req.body;

        return await ctInventarioMaterialBaseService.actualizar(id_ct_inventario_marca, inventarioMaterialData);
      },
      "Material actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar material
   * @route DELETE /api/ct_inventario_material/:id_ct_inventario_marca
   */
  eliminarInventarioMaterial = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_marca } = this.validarDatosConEsquema<CtInventarioMaterialIdParam>(
          ctInventarioMaterialIdParamSchema,
          req.params
        );

        await ctInventarioMaterialBaseService.eliminar(id_ct_inventario_marca);
      },
      "Material eliminado exitosamente"
    );
  };
}

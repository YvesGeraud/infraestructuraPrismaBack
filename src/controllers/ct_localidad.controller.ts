import { Request, Response } from "express";
import { BaseController } from "./BaseController";
    import { CtLocalidadBaseService } from "../services/ct_localidad.service";
import {
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  ctLocalidadIdParamSchema,
  CtLocalidadIdParam,
  EliminarCtLocalidadInput,
  eliminarCtLocalidadSchema,
} from "../schemas/ct_localidad.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ENTIDAD CON BASE SERVICE =====
    const ctLocalidadBaseService = new CtLocalidadBaseService();

export class CtLocalidadBaseController extends BaseController {
  /**
   * 📦 Crear nueva entidad
   * @route POST /api/inventario/marca
   */
  crearLocalidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const localidadData: CrearCtLocalidadInput = req.body;
        return await ctLocalidadBaseService.crear(localidadData);
      },
        "Localidad creada exitosamente"
    );
  };

  /**
   * 📦 Obtener localidad por ID
   * @route GET /api/inventario/entidad/:id_entidad
   */
  obtenerLocalidadPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_localidad } = this.validarDatosConEsquema<CtLocalidadIdParam>(
          ctLocalidadIdParamSchema,
          req.params
        );

            return await ctLocalidadBaseService.obtenerPorId(id_ct_localidad);
      },
      "Localidad obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las entidades con filtros y paginación
   * @route GET /api/inventario/entidad
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasLocalidades = async (
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

                return await ctLocalidadBaseService.obtenerTodos(filters, pagination);
      },
      "Localidades obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar localidad
   * @route PUT /api/inventario/marca/:id_marca
   */
  actualizarLocalidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
            const { id_ct_localidad } = this.validarDatosConEsquema<CtLocalidadIdParam>(
          ctLocalidadIdParamSchema,
          req.params
        );
        const localidadData: ActualizarCtLocalidadInput = req.body;

        return await ctLocalidadBaseService.actualizar(id_ct_localidad, localidadData);
      },
      "Localidad actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar localidad
   * @route DELETE /api/inventario/marca/:id_marca
   */
  eliminarLocalidad = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );

        const { id_ct_usuario_up } =
          this.validarDatosConEsquema<EliminarCtLocalidadInput>(
            eliminarCtLocalidadSchema,
            req.body
          );

        await ctLocalidadBaseService.eliminar(
          id_ct_localidad,
          id_ct_usuario_up
        );
      },
      "Localidad eliminada exitosamente"
    );
  };
}


import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { CtLocalidadBaseService } from "../services/ct_localidad.service";
import {
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  ctLocalidadIdParamSchema,
  CtLocalidadIdParam,
} from "../schemas/ct_localidad.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_LOCALIDAD CON BASE SERVICE =====
const ctLocalidadBaseService = new CtLocalidadBaseService();

export class CtLocalidadBaseController extends BaseController {
  /**
   * 📦 Crear nueva localidad
   * @route POST /api/ct_localidad
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
   * @route GET /api/ct_localidad/:id_localidad
   */
  obtenerLocalidadPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );

        return await ctLocalidadBaseService.obtenerPorId(id_localidad);
      },
      "Localidad obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las localidades con filtros y paginación
   * @route GET /api/ct_localidad
   *
   * Query parameters soportados:
   * - localidad: Filtrar por localidad (búsqueda parcial)
   * - id_municipio: Filtrar por ID de municipio
   * - ambito: Filtrar por ámbito ("U" urbano / "R" rural)
   * - incluir_municipio: Incluir datos del municipio (true/false)
   * - incluir_detalle_completo: Incluir municipio + estado (true/false)
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
        // 🔧 Separar filtros de paginación
        const { pagina, limite, ...filters } = req.query as any;
        const pagination = { pagina, limite };

        return await ctLocalidadBaseService.obtenerTodos(filters, pagination);
      },
      "Localidades obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar localidad
   * @route PUT /api/ct_localidad/:id_localidad
   */
  actualizarLocalidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );
        const localidadData: ActualizarCtLocalidadInput = req.body;

        return await ctLocalidadBaseService.actualizar(
          id_localidad,
          localidadData
        );
      },
      "Localidad actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar localidad
   * @route DELETE /api/ct_localidad/:id_localidad
   */
  eliminarLocalidad = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );

        await ctLocalidadBaseService.eliminar(id_localidad);
      },
      "Localidad eliminada exitosamente"
    );
  };
}

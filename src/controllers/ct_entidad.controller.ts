import { Request, Response } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
import { BaseController } from "./BaseController";
import { CtEntidadBaseService } from "../services/ct_entidad.service";
import {
  CrearCtEntidadInput,
  ActualizarCtEntidadInput,
  ctEntidadIdParamSchema,
  CtEntidadIdParam,
} from "../schemas/ct_entidad.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ENTIDAD CON BASE SERVICE =====
const ctEntidadBaseService = new CtEntidadBaseService();

export class CtEntidadBaseController extends BaseController {
  /**
   * 📦 Crear nueva entidad
   * @route POST /api/ct_entidad
   * 🔐 Requiere autenticación
   */
  crearEntidad = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
const entidadData: CrearCtEntidadInput = req.body;

        return await ctEntidadBaseService.crear(
          entidadData,
          idSesion,
          idUsuario
        );
      },
      "Entidad creada exitosamente"
    );
  };

  /**
   * 📦 Obtener entidad por ID
   * @route GET /api/ct_entidad/:id_ct_entidad
   */
  obtenerEntidadPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_entidad } = this.validarDatosConEsquema<CtEntidadIdParam>(
          ctEntidadIdParamSchema,
          req.params
        );

        return await ctEntidadBaseService.obtenerPorId(id_ct_entidad);
      },
      "Entidad obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las entidades con filtros y paginación
   * @route GET /api/ct_entidad
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasEntidades = async (
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

        return await ctEntidadBaseService.obtenerTodos(filters, pagination);
      },
      "Entidades obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar entidad
   * @route PUT /api/ct_entidad/:id_ct_entidad
   * 🔐 Requiere autenticación
   */
  actualizarEntidad = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
const { id_ct_entidad } = this.validarDatosConEsquema<CtEntidadIdParam>(
          ctEntidadIdParamSchema,
          req.params
        );
        const entidadData: ActualizarCtEntidadInput = req.body;

        return await ctEntidadBaseService.actualizar(
          id_ct_entidad,
          entidadData,
          idSesion,
          idUsuario
        );
      },
      "Entidad actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar entidad (soft delete)
   * @route DELETE /api/ct_entidad/:id_ct_entidad
   * 🔐 Requiere autenticación
   */
  eliminarEntidad = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
const { id_ct_entidad } = this.validarDatosConEsquema<CtEntidadIdParam>(
          ctEntidadIdParamSchema,
          req.params
        );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctEntidadBaseService.eliminar(id_ct_entidad, idUsuario, idSesion);
      },
      "Entidad eliminada exitosamente"
    );
  };
}

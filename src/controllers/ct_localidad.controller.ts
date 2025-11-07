import { Request, Response } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt} from "../utils/bitacoraUtils";
import { BaseController } from "./BaseController";
import { CtLocalidadBaseService } from "../services/ct_localidad.service";
import {
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  ctLocalidadIdParamSchema,
  CtLocalidadIdParam} from "../schemas/ct_localidad.schema";
import { PaginationInput } from "../schemas/commonSchemas";

// ===== CONTROLADOR PARA CT_LOCALIDAD CON BASE SERVICE =====
const ctLocalidadBaseService = new CtLocalidadBaseService();

export class CtLocalidadBaseController extends BaseController {
  /**
   * 📦 Crear nueva localidad
   * @route POST /api/ct_localidad
   * 🔐 Requiere autenticación
   */
  crearLocalidad = async (
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
const localidadData: CrearCtLocalidadInput = req.body;

        return await ctLocalidadBaseService.crear(
          localidadData,
          idSesion,
          idUsuario
        );
      },
      "Localidad creada exitosamente"
    );
  };

  /**
   * 📦 Obtener localidad por ID
   * @route GET /api/ct_localidad/:id_ct_localidad
   */
  obtenerLocalidadPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );

        return await ctLocalidadBaseService.obtenerPorId(id_ct_localidad);
      },
      "Localidad obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las localidades con filtros y paginación
   * @route GET /api/ct_localidad
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - id_ct_municipio: Filtrar por municipio
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
   * @route PUT /api/ct_localidad/:id_ct_localidad
   * 🔐 Requiere autenticación
   */
  actualizarLocalidad = async (
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
const { id_ct_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );
        const localidadData: ActualizarCtLocalidadInput = req.body;

        return await ctLocalidadBaseService.actualizar(
          id_ct_localidad,
          localidadData,
          idSesion,
          idUsuario
        );
      },
      "Localidad actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar localidad (soft delete)
   * @route DELETE /api/ct_localidad/:id_ct_localidad
   * 🔐 Requiere autenticación
   */
  eliminarLocalidad = async (
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
const { id_ct_localidad } =
          this.validarDatosConEsquema<CtLocalidadIdParam>(
            ctLocalidadIdParamSchema,
            req.params
          );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctLocalidadBaseService.eliminar(
          id_ct_localidad,
          idUsuario,
          idSesion
        );
      },
      "Localidad eliminada exitosamente"
    );
  };
}

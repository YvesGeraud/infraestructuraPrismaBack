import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { DtInfraestructuraUbicacionBaseService } from "../../services/infraestructura/dt_infraestructura_ubicacion.service";
import {
  CrearDtInfraestructuraUbicacionInput,
  ActualizarDtInfraestructuraUbicacionInput,
  dtInfraestructuraUbicacionIdParamSchema,
  DtInfraestructuraUbicacionIdParam,
} from "../../schemas/infraestructura/dt_infraestructura_ubicacion.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA DT_INFRAESTRUCTURA_UBICACION CON BASE SERVICE =====
const dtInfraestructuraUbicacionBaseService = new DtInfraestructuraUbicacionBaseService();

export class DtInfraestructuraUbicacionBaseController extends BaseController {
  /**
   * 📦 Crear nueva ubicación
   * @route POST /api/dt_infraestructura_ubicacion
   * 🔐 Requiere autenticación
   */
  crearUbicacion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);

        const ubicacionData: CrearDtInfraestructuraUbicacionInput = req.body;
        return await dtInfraestructuraUbicacionBaseService.crear(ubicacionData, idSesion);
      },
      "Ubicación creada exitosamente"
    );
  };

  /**
   * 📦 Obtener ubicación por ID
   * @route GET /api/dt_infraestructura_ubicacion/:id_dt_infraestructura_ubicacion
   */
  obtenerUbicacionPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_dt_infraestructura_ubicacion } = this.validarDatosConEsquema<DtInfraestructuraUbicacionIdParam>(
          dtInfraestructuraUbicacionIdParamSchema,
          req.params
        );

        return await dtInfraestructuraUbicacionBaseService.obtenerPorId(id_dt_infraestructura_ubicacion);
      },
      "Ubicación obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las ubicaciones con filtros y paginación
   * @route GET /api/dt_infraestructura_ubicacion
   *
   * Query parameters soportados:
   * - calle: Filtrar por calle (búsqueda parcial)
   * - colonia: Filtrar por colonia (búsqueda parcial)
   * - id_ct_localidad: Filtrar por localidad
   * - id_ct_codigo_postal: Filtrar por código postal
   * - incluir_localidad: Incluir datos de la localidad
   * - incluir_codigo_postal: Incluir datos del código postal
   * - incluir_todas_relaciones: Incluir todas las relaciones
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasUbicaciones = async (
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

        return await dtInfraestructuraUbicacionBaseService.obtenerTodos(filters, pagination);
      },
      "Ubicaciones obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar ubicación
   * @route PUT /api/dt_infraestructura_ubicacion/:id_dt_infraestructura_ubicacion
   * 🔐 Requiere autenticación
   */
  actualizarUbicacion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_dt_infraestructura_ubicacion } = this.validarDatosConEsquema<DtInfraestructuraUbicacionIdParam>(
          dtInfraestructuraUbicacionIdParamSchema,
          req.params
        );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const ubicacionData: ActualizarDtInfraestructuraUbicacionInput = req.body;

        return await dtInfraestructuraUbicacionBaseService.actualizar(
          id_dt_infraestructura_ubicacion,
          ubicacionData,
          idSesion
        );
      },
      "Ubicación actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar ubicación (soft delete)
   * @route DELETE /api/dt_infraestructura_ubicacion/:id_dt_infraestructura_ubicacion
   * 🔐 Requiere autenticación
   */
  eliminarUbicacion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_dt_infraestructura_ubicacion } = this.validarDatosConEsquema<DtInfraestructuraUbicacionIdParam>(
          dtInfraestructuraUbicacionIdParamSchema,
          req.params
        );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await dtInfraestructuraUbicacionBaseService.eliminar(
          id_dt_infraestructura_ubicacion,
          idUsuario,
          idSesion
        );
      },
      "Ubicación eliminada exitosamente"
    );
  };
}

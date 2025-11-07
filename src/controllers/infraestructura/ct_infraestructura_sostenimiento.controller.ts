import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInfraestructuraSostenimientoBaseService } from "../../services/infraestructura/ct_infraestructura_sostenimiento.service";
import {
  CrearCtInfraestructuraSostenimientoInput,
  ActualizarCtInfraestructuraSostenimientoInput,
  ctInfraestructuraSostenimientoIdParamSchema,
  CtInfraestructuraSostenimientoIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_sostenimiento.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_SOSTENIMIENTO CON BASE SERVICE =====
const ctInfraestructuraSostenimientoBaseService = new CtInfraestructuraSostenimientoBaseService();

export class CtInfraestructuraSostenimientoBaseController extends BaseController {
  /**
   * 📦 Crear nuevo sostenimiento
   * @route POST /api/ct_infraestructura_sostenimiento
   * 🔐 Requiere autenticación
   */
  crearSostenimiento = async (
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
const sostenimientoData: CrearCtInfraestructuraSostenimientoInput = req.body;

         return await ctInfraestructuraSostenimientoBaseService.crear(sostenimientoData, idSesion, idUsuario);
      },
      "Sostenimiento creado exitosamente"
    );
  };

  /**
   * 📦 Obtener sostenimiento por ID
   * @route GET /api/ct_infraestructura_sostenimiento/:id_ct_infraestructura_sostenimiento
   */
  obtenerSostenimientoPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_sostenimiento } = this.validarDatosConEsquema<CtInfraestructuraSostenimientoIdParam>(
          ctInfraestructuraSostenimientoIdParamSchema,
          req.params
        );

        return await ctInfraestructuraSostenimientoBaseService.obtenerPorId(id_ct_infraestructura_sostenimiento);
      },
      "Sostenimiento obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los sostenimientos con filtros y paginación
   * @route GET /api/ct_infraestructura_sostenimiento
   *
   * Query parameters soportados:
   * - sostenimiento: Filtrar por sostenimiento (búsqueda parcial)
   * - incluir_escuelas: Incluir escuelas relacionadas
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosSostenimientos = async (
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

        return await ctInfraestructuraSostenimientoBaseService.obtenerTodos(filters, pagination);
      },
      "Sostenimientos obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar sostenimiento
   * @route PUT /api/ct_infraestructura_sostenimiento/:id_ct_infraestructura_sostenimiento
   * 🔐 Requiere autenticación
   */
  actualizarSostenimiento = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_sostenimiento } = this.validarDatosConEsquema<CtInfraestructuraSostenimientoIdParam>(
          ctInfraestructuraSostenimientoIdParamSchema,
          req.params
        );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
        const sostenimientoData: ActualizarCtInfraestructuraSostenimientoInput = req.body;

        return await ctInfraestructuraSostenimientoBaseService.actualizar(id_ct_infraestructura_sostenimiento, sostenimientoData, idSesion, idUsuario);
      },
      "Sostenimiento actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar sostenimiento (soft delete)
   * @route DELETE /api/ct_infraestructura_sostenimiento/:id_ct_infraestructura_sostenimiento
   * 🔐 Requiere autenticación
   */
  eliminarSostenimiento = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_sostenimiento } = this.validarDatosConEsquema<CtInfraestructuraSostenimientoIdParam>(
          ctInfraestructuraSostenimientoIdParamSchema,
          req.params
        );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInfraestructuraSostenimientoBaseService.eliminar(
          id_ct_infraestructura_sostenimiento,
          idUsuario,
          idSesion
        );
      },
      "Sostenimiento eliminado exitosamente"
    );
  };
}

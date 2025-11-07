import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { DtBitacoraBaseService } from "../../services/bitacora/dt_bitacora.service";
import {
  CrearDtBitacoraInput,
  ActualizarDtBitacoraInput,
  dtBitacoraIdParamSchema,
  DtBitacoraIdParam,
} from "../../schemas/bitacora/dt_bitacora.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA DT_BITACORA CON BASE SERVICE =====
const dtBitacoraBaseService = new DtBitacoraBaseService();

export class DtBitacoraBaseController extends BaseController {
  /**
   * 📦 Crear nuevo registro de bitácora
   * @route POST /api/dt_bitacora
   * 🔐 Requiere autenticación
   */
  crearBitacora = async (
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
        const bitacoraData: CrearDtBitacoraInput = req.body;

        return await dtBitacoraBaseService.crear(
          bitacoraData,
          idSesion,
          idUsuario
        );
      },
      "Registro de bitácora creado exitosamente"
    );
  };

  /**
   * 📦 Obtener registro de bitácora por ID
   * @route GET /api/dt_bitacora/:id_dt_bitacora
   */
  obtenerBitacoraPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_dt_bitacora } =
          this.validarDatosConEsquema<DtBitacoraIdParam>(
            dtBitacoraIdParamSchema,
            req.params
          );

        return await dtBitacoraBaseService.obtenerPorId(id_dt_bitacora);
      },
      "Registro de bitácora obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los registros de bitácora con filtros y paginación
   * @route GET /api/dt_bitacora
   *
   * Query parameters soportados:
   * - id_ct_bitacora_accion: Filtrar por acción
   * - id_ct_bitacora_tabla: Filtrar por tabla
   * - id_registro_afectado: Filtrar por registro afectado
   * - id_ct_sesion: Filtrar por sesión
   * - incluir_accion: Incluir datos de la acción
   * - incluir_tabla: Incluir datos de la tabla
   * - incluir_sesion: Incluir datos de la sesión
   * - incluir_todas_relaciones: Incluir todas las relaciones
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasBitacoras = async (
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

        return await dtBitacoraBaseService.obtenerTodos(filters, pagination);
      },
      "Registros de bitácora obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar registro de bitácora
   * @route PUT /api/dt_bitacora/:id_dt_bitacora
   * 🔐 Requiere autenticación
   */
  actualizarBitacora = async (
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
        const { id_dt_bitacora } =
          this.validarDatosConEsquema<DtBitacoraIdParam>(
            dtBitacoraIdParamSchema,
            req.params
          );
        const bitacoraData: ActualizarDtBitacoraInput = req.body;

        return await dtBitacoraBaseService.actualizar(
          id_dt_bitacora,
          bitacoraData,
          idSesion,
          idUsuario
        );
      },
      "Registro de bitácora actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar registro de bitácora (soft delete)
   * @route DELETE /api/dt_bitacora/:id_dt_bitacora
   * 🔐 Requiere autenticación
   */
  eliminarBitacora = async (
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
        const { id_dt_bitacora } =
          this.validarDatosConEsquema<DtBitacoraIdParam>(
            dtBitacoraIdParamSchema,
            req.params
          );

        await dtBitacoraBaseService.eliminar(
          id_dt_bitacora,
          idUsuario,
          idSesion
        );
      },
      "Registro de bitácora eliminado exitosamente"
    );
  };
}

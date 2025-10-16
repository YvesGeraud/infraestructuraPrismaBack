import { Request, Response } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
import { BaseController } from "./BaseController";
import { CtBitacoraAccionBaseService } from "../services/ct_bitacora_accion.service";
import {
  CrearCtBitacoraAccionInput,
  ActualizarCtBitacoraAccionInput,
  ctBitacoraAccionIdParamSchema,
  CtBitacoraAccionIdParam,
} from "../schemas/ct_bitacora_accion.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_BITACORA_ACCION CON BASE SERVICE =====
const ctBitacoraAccionBaseService = new CtBitacoraAccionBaseService();

export class CtBitacoraAccionBaseController extends BaseController {
  /**
   * 📦 Crear nueva acción de bitácora
   * @route POST /api/ct_bitacora_accion
   * 🔐 Requiere autenticación
   */
  crearAccion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);

        const entidadData: CrearCtBitacoraAccionInput = req.body;
        return await ctBitacoraAccionBaseService.crear(entidadData, idSesion);
      },
      "Acción creada exitosamente"
    );
  };

  /**
   * 📦 Obtener acción por ID
   * @route GET /api/ct_bitacora_accion/:id_ct_bitacora_accion
   */
  obtenerAccionPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_bitacora_accion } =
          this.validarDatosConEsquema<CtBitacoraAccionIdParam>(
            ctBitacoraAccionIdParamSchema,
            req.params
          );

        return await ctBitacoraAccionBaseService.obtenerPorId(
          id_ct_bitacora_accion
        );
      },
      "Acción obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las acciones con filtros y paginación
   * @route GET /api/ct_bitacora_accion
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasAcciones = async (
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

        return await ctBitacoraAccionBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Acciones obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar acción de bitácora
   * @route PUT /api/ct_bitacora_accion/:id_ct_bitacora_accion
   * 🔐 Requiere autenticación
   */
  actualizarAccion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);

        const { id_ct_bitacora_accion } =
          this.validarDatosConEsquema<CtBitacoraAccionIdParam>(
            ctBitacoraAccionIdParamSchema,
            req.params
          );
        const accionData: ActualizarCtBitacoraAccionInput = req.body;

        return await ctBitacoraAccionBaseService.actualizar(
          id_ct_bitacora_accion,
          accionData,
          idSesion
        );
      },
      "Acción actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar acción (soft delete)
   * @route DELETE /api/ct_bitacora_accion/:id_ct_bitacora_accion
   * 🔐 Requiere autenticación
   */
  eliminarAccion = async (
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

        const { id_ct_bitacora_accion } =
          this.validarDatosConEsquema<CtBitacoraAccionIdParam>(
            ctBitacoraAccionIdParamSchema,
            req.params
          );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctBitacoraAccionBaseService.eliminar(
          id_ct_bitacora_accion,
          idUsuario,
          idSesion
        );
      },
      "Acción eliminada exitosamente"
    );
  };
}

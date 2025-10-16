import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInventarioBajaBaseService } from "../../services/inventario/ct_inventario_baja.service";
import {
  CrearCtInventarioBajaInput,
  ActualizarCtInventarioBajaInput,
  ctInventarioBajaIdParamSchema,
  CtInventarioBajaIdParam,
} from "../../schemas/inventario/ct_inventario_baja.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

// ===== CONTROLADOR PARA CT_INVENTARIO_BAJA CON BASE SERVICE =====
const ctInventarioBajaBaseService = new CtInventarioBajaBaseService();

export class CtInventarioBajaBaseController extends BaseController {
  /**
   * 📦 Crear nueva inventario baja
   * @route POST /api/ct_inventario_baja
   * 🔐 Requiere autenticación
   */
  crearInventarioBaja = async (
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
const inventarioBajaData: CrearCtInventarioBajaInput = req.body;

        return await ctInventarioBajaBaseService.crear(
          inventarioBajaData,
          idSesion,
          idUsuario
        );
      },
      "Inventario baja creada exitosamente"
    );
  };

  /**
   * 📦 Obtener inventario baja por ID
   * @route GET /api/ct_inventario_baja/:id_ct_inventario_baja
   */
  obtenerInventarioBajaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_baja } =
          this.validarDatosConEsquema<CtInventarioBajaIdParam>(
            ctInventarioBajaIdParamSchema,
            req.params
          );

        return await ctInventarioBajaBaseService.obtenerPorId(
          id_ct_inventario_baja
        );
      },
      "Inventario baja obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las inventario baja con filtros y paginación
   * @route GET /api/ct_inventario_baja
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - id_ct_inventario_baja: Filtrar por inventario baja
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioBaja = async (
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

        return await ctInventarioBajaBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Inventario baja obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar inventario baja
   * @route PUT /api/ct_inventario_baja/:id_ct_inventario_baja
   * 🔐 Requiere autenticación
   */
  actualizarInventarioBaja = async (
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
const { id_ct_inventario_baja } =
          this.validarDatosConEsquema<CtInventarioBajaIdParam>(
            ctInventarioBajaIdParamSchema,
            req.params
          );
        const inventarioBajaData: ActualizarCtInventarioBajaInput = req.body;

        return await ctInventarioBajaBaseService.actualizar(
          id_ct_inventario_baja,
          inventarioBajaData,
          idUsuario,
          idSesion
        );
      },
      "Inventario baja actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar inventario baja (soft delete)
   * @route DELETE /api/ct_inventario_baja/:id_ct_inventario_baja
   * 🔐 Requiere autenticación
   */
  eliminarInventarioBaja = async (
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
const { id_ct_inventario_baja } =
          this.validarDatosConEsquema<CtInventarioBajaIdParam>(
            ctInventarioBajaIdParamSchema,
            req.params
          );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInventarioBajaBaseService.eliminar(
          id_ct_inventario_baja,
          idUsuario,
          idSesion
        );
      },
      "Inventario baja eliminada exitosamente"
    );
  };
}

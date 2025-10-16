import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInventarioClaseBaseService } from "../../services/inventario/ct_inventario_clase.service";
import {
  CrearCtInventarioClaseInput,
  ActualizarCtInventarioClaseInput,
  ctInventarioClaseIdParamSchema,
  CtInventarioClaseIdParam,
} from "../../schemas/inventario/ct_inventario_clase.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_CLASE CON BASE SERVICE =====
const ctInventarioClaseBaseService = new CtInventarioClaseBaseService();

export class CtInventarioClaseBaseController extends BaseController {
  /**
   * 📦 Crear nueva clase de inventario
   * @route POST /api/ct_inventario_clase
   * 🔐 Requiere autenticación
   */
  crearInventarioClase = async (
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
const inventarioClaseData: CrearCtInventarioClaseInput = req.body;

        return await ctInventarioClaseBaseService.crear(
          inventarioClaseData,
          idSesion,
          idUsuario
        );
      },
      "Clase de inventario creada exitosamente"
    );
  };

  /**
   * 📦 Obtener clase de inventario por ID
   * @route GET /api/ct_inventario_clase/:id_ct_inventario_clase
   */
  obtenerInventarioClasePorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_clase } =
          this.validarDatosConEsquema<CtInventarioClaseIdParam>(
            ctInventarioClaseIdParamSchema,
            req.params
          );

        return await ctInventarioClaseBaseService.obtenerPorId(
          id_ct_inventario_clase
        );
      },
      "Clase de inventario obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las clases de inventario con filtros y paginación
   * @route GET /api/ct_inventario_clase
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - incluir_subclases: Incluir subclases relacionadas
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioClases = async (
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

        return await ctInventarioClaseBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Clases de inventario obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar clase de inventario
   * @route PUT /api/ct_inventario_clase/:id_ct_inventario_clase
   * 🔐 Requiere autenticación
   */
  actualizarInventarioClase = async (
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
const { id_ct_inventario_clase } =
          this.validarDatosConEsquema<CtInventarioClaseIdParam>(
            ctInventarioClaseIdParamSchema,
            req.params
          );
        const inventarioClaseData: ActualizarCtInventarioClaseInput = req.body;

        return await ctInventarioClaseBaseService.actualizar(
          id_ct_inventario_clase,
          inventarioClaseData,
          idUsuario,
          idSesion
        );
      },
      "Clase de inventario actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar clase de inventario (soft delete)
   * @route DELETE /api/ct_inventario_clase/:id_ct_inventario_clase
   * 🔐 Requiere autenticación
   */
  eliminarInventarioClase = async (
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
const { id_ct_inventario_clase } =
          this.validarDatosConEsquema<CtInventarioClaseIdParam>(
            ctInventarioClaseIdParamSchema,
            req.params
          );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInventarioClaseBaseService.eliminar(
          id_ct_inventario_clase,
          idUsuario,
          idSesion
        );
      },
      "Clase de inventario eliminada exitosamente"
    );
  };
}

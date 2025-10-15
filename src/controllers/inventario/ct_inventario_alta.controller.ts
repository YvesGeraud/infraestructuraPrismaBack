import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInventarioAltaBaseService } from "../../services/inventario/ct_inventario_alta.service";
import {
  CrearCtInventarioAltaInput,
  ActualizarCtInventarioAltaInput,
  ctInventarioAltaIdParamSchema,
  CtInventarioAltaIdParam,
  EliminarCtInventarioAltaInput,
  eliminarCtInventarioAltaSchema,
} from "../../schemas/inventario/ct_inventario_alta.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

// ===== CONTROLADOR PARA CT_INVENTARIO_ALTA CON BASE SERVICE =====
const ctInventarioAltaBaseService = new CtInventarioAltaBaseService();

export class CtInventarioAltaBaseController extends BaseController {
  /**
   * 📦 Crear nueva inventario alta
   * @route POST /api/ct_inventario_alta
   * 🔐 Requiere autenticación
   */
  crearInventarioAlta = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(req, res, async () => {
      // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
      const idSesion = obtenerIdSesionDesdeJwt(req);

      const inventarioAltaData: CrearCtInventarioAltaInput = req.body;
      return await ctInventarioAltaBaseService.crear(inventarioAltaData, idSesion);
    }, "Inventario alta creada exitosamente");
  };

  /**
   * 📦 Obtener inventario alta por ID
   * @route GET /api/ct_inventario_alta/:id_ct_inventario_alta
   */
  obtenerInventarioAltaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_alta } = this.validarDatosConEsquema<CtInventarioAltaIdParam>(
          ctInventarioAltaIdParamSchema,
          req.params
        );

            return await ctInventarioAltaBaseService.obtenerPorId(id_ct_inventario_alta);
      },
      "Inventario alta obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las inventario alta con filtros y paginación
   * @route GET /api/ct_inventario_alta
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - id_ct_inventario_alta: Filtrar por inventario alta
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioAlta = async (
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

                return await ctInventarioAltaBaseService.obtenerTodos(filters, pagination);
      },
      "Inventario alta obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar inventario alta
   * @route PUT /api/ct_inventario_alta/:id_ct_inventario_alta
   * 🔐 Requiere autenticación
   */
  actualizarInventarioAlta = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(req, res, async () => {
      // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
      const idSesion = obtenerIdSesionDesdeJwt(req);

      const { id_ct_inventario_alta } =
        this.validarDatosConEsquema<CtInventarioAltaIdParam>(
          ctInventarioAltaIdParamSchema,
          req.params
        );
      const inventarioAltaData: ActualizarCtInventarioAltaInput = req.body;

      return await ctInventarioAltaBaseService.actualizar(
        id_ct_inventario_alta,
        inventarioAltaData,
        idSesion
      );
    }, "Inventario alta actualizada exitosamente");
  };

  /**
   * 📦 Eliminar inventario alta (soft delete)
   * @route DELETE /api/ct_inventario_alta/:id_ct_inventario_alta
   * 🔐 Requiere autenticación
   */
  eliminarInventarioAlta = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(req, res, async () => {
      // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
      const idSesion = obtenerIdSesionDesdeJwt(req);
      const idUsuario = obtenerIdUsuarioDesdeJwt(req);

      const { id_ct_inventario_alta } =
        this.validarDatosConEsquema<CtInventarioAltaIdParam>(
          ctInventarioAltaIdParamSchema,
          req.params
        );

      // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
      await ctInventarioAltaBaseService.eliminar(
        id_ct_inventario_alta,
        idUsuario,
        idSesion
      );
    }, "Inventario alta eliminada exitosamente");
  };
}


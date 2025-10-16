import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInfraestructuraDireccionBaseService } from "../../services/infraestructura/ct_infraestructura_direccion.service";
import {
  CrearCtInfraestructuraDireccionInput,
  ActualizarCtInfraestructuraDireccionInput,
  ctInfraestructuraDireccionIdParamSchema,
  CtInfraestructuraDireccionIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_direccion.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_DIRECCION CON BASE SERVICE =====
const ctInfraestructuraDireccionBaseService = new CtInfraestructuraDireccionBaseService();

export class CtInfraestructuraDireccionBaseController extends BaseController {
  /**
   * 📦 Crear nueva dirección
   * @route POST /api/ct_infraestructura_direccion
   * 🔐 Requiere autenticación
   */
  crearDireccion = async (
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
const direccionData: CrearCtInfraestructuraDireccionInput = req.body;

         return await ctInfraestructuraDireccionBaseService.crear(direccionData, idSesion, idUsuario);
      },
      "Dirección creada exitosamente"
    );
  };

  /**
   * 📦 Obtener dirección por ID
   * @route GET /api/ct_infraestructura_direccion/:id_ct_infraestructura_direccion
   */
  obtenerDireccionPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_direccion } = this.validarDatosConEsquema<CtInfraestructuraDireccionIdParam>(
          ctInfraestructuraDireccionIdParamSchema,
          req.params
        );

        return await ctInfraestructuraDireccionBaseService.obtenerPorId(id_ct_infraestructura_direccion);
      },
      "Dirección obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las direcciones con filtros y paginación
   * @route GET /api/ct_infraestructura_direccion
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasDirecciones = async (
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

        return await ctInfraestructuraDireccionBaseService.obtenerTodos(filters, pagination);
      },
      "Direcciones obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar dirección
   * @route PUT /api/ct_infraestructura_direccion/:id_ct_infraestructura_direccion
   * 🔐 Requiere autenticación
   */
  actualizarDireccion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_direccion } = this.validarDatosConEsquema<CtInfraestructuraDireccionIdParam>(
          ctInfraestructuraDireccionIdParamSchema,
          req.params
        );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
        const direccionData: ActualizarCtInfraestructuraDireccionInput = req.body;

        return await ctInfraestructuraDireccionBaseService.actualizar(id_ct_infraestructura_direccion, direccionData, idSesion, idUsuario);
      },
      "Dirección actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar dirección (soft delete)
   * @route DELETE /api/ct_infraestructura_direccion/:id_ct_infraestructura_direccion
   * 🔐 Requiere autenticación
   */
  eliminarDireccion = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_direccion } = this.validarDatosConEsquema<CtInfraestructuraDireccionIdParam>(
          ctInfraestructuraDireccionIdParamSchema,
          req.params
        );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInfraestructuraDireccionBaseService.eliminar(
          id_ct_infraestructura_direccion,
          idUsuario,
          idSesion
        );
      },
      "Dirección eliminada exitosamente"
    );
  };
}

import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { RlInfraestructuraJerarquiaBaseService } from "../../services/infraestructura/rl_infraestructura_jerarquia.service";
import {
  CrearRlInfraestructuraJerarquiaInput,
  ActualizarRlInfraestructuraJerarquiaInput,
  rlInfraestructuraJerarquiaIdParamSchema,
  RlInfraestructuraJerarquiaIdParam,
} from "../../schemas/infraestructura/rl_infraestructura_jerarquia.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

// ===== CONTROLADOR PARA RL_INFRAESTRUCTURA_JERARQUIA CON BASE SERVICE =====
const rlInfraestructuraJerarquiaBaseService =
  new RlInfraestructuraJerarquiaBaseService();

export class RlInfraestructuraJerarquiaBaseController extends BaseController {
  /**
   * 📦 Crear nueva relación jerárquica
   * @route POST /api/rl_infraestructura_jerarquia
   * 🔐 Requiere autenticación
   */
  crearJerarquia = async (
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
        const jerarquiaData: CrearRlInfraestructuraJerarquiaInput = req.body;

        return await rlInfraestructuraJerarquiaBaseService.crear(
          jerarquiaData,
          idSesion,
          idUsuario
        );
      },
      "Relación jerárquica creada exitosamente"
    );
  };

  /**
   * 📦 Obtener jerarquía por ID
   * @route GET /api/rl_infraestructura_jerarquia/:id_rl_infraestructura_jerarquia
   */
  obtenerJerarquiaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_rl_infraestructura_jerarquia } =
          this.validarDatosConEsquema<RlInfraestructuraJerarquiaIdParam>(
            rlInfraestructuraJerarquiaIdParamSchema,
            req.params
          );

        // Verificar si se solicita con dependencia
        const incluirDependencia = req.query.incluir_dependencia === "true";

        if (incluirDependencia) {
          return await rlInfraestructuraJerarquiaBaseService.obtenerConDependencia(
            id_rl_infraestructura_jerarquia
          );
        }

        return await rlInfraestructuraJerarquiaBaseService.obtenerPorId(
          id_rl_infraestructura_jerarquia,
          req.query as any
        );
      },
      "Relación jerárquica obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las jerarquías con filtros y paginación
   * @route GET /api/rl_infraestructura_jerarquia
   *
   * Query parameters soportados:
   * - id_instancia: Filtrar por ID de instancia
   * - id_ct_infraestructura_tipo_instancia: Filtrar por tipo de instancia
   * - id_dependencia: Filtrar por dependencia (null para nivel superior)
   * - incluir_tipo_instancia: Incluir información del tipo de instancia
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasJerarquias = async (
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

        return await rlInfraestructuraJerarquiaBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Relaciones jerárquicas obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar jerarquía
   * @route PUT /api/rl_infraestructura_jerarquia/:id_rl_infraestructura_jerarquia
   * 🔐 Requiere autenticación
   */
  actualizarJerarquia = async (
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
        const { id_rl_infraestructura_jerarquia } =
          this.validarDatosConEsquema<RlInfraestructuraJerarquiaIdParam>(
            rlInfraestructuraJerarquiaIdParamSchema,
            req.params
          );
        const jerarquiaData: ActualizarRlInfraestructuraJerarquiaInput =
          req.body;

        return await rlInfraestructuraJerarquiaBaseService.actualizar(
          id_rl_infraestructura_jerarquia,
          jerarquiaData,
          idSesion,
          idUsuario
        );
      },
      "Relación jerárquica actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar jerarquía (soft delete)
   * @route DELETE /api/rl_infraestructura_jerarquia/:id_rl_infraestructura_jerarquia
   * 🔐 Requiere autenticación
   */
  eliminarJerarquia = async (
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
        const { id_rl_infraestructura_jerarquia } =
          this.validarDatosConEsquema<RlInfraestructuraJerarquiaIdParam>(
            rlInfraestructuraJerarquiaIdParamSchema,
            req.params
          );

        await rlInfraestructuraJerarquiaBaseService.eliminar(
          id_rl_infraestructura_jerarquia,
          idUsuario,
          idSesion
        );
      },
      "Relación jerárquica eliminada exitosamente"
    );
  };

  /**
   * 📊 Obtener cadena completa de dependencias
   * @route GET /api/rl_infraestructura_jerarquia/:id_rl_infraestructura_jerarquia/cadena
   */
  obtenerCadenaCompletaDependencias = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_rl_infraestructura_jerarquia } =
          this.validarDatosConEsquema<RlInfraestructuraJerarquiaIdParam>(
            rlInfraestructuraJerarquiaIdParamSchema,
            req.params
          );

        return await rlInfraestructuraJerarquiaBaseService.obtenerCadenaCompletaDependencias(
          id_rl_infraestructura_jerarquia
        );
      },
      "Cadena de dependencias obtenida exitosamente"
    );
  };
}

import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInfraestructuraTipoEscuelaBaseService } from "../../services/infraestructura/ct_infraestructura_tipo_escuela.service";
import {
  CrearCtInfraestructuraTipoEscuelaInput,
  ActualizarCtInfraestructuraTipoEscuelaInput,
  ctInfraestructuraTipoEscuelaIdParamSchema,
  CtInfraestructuraTipoEscuelaIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_tipo_escuela.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_TIPO_ESCUELA CON BASE SERVICE =====
const ctInfraestructuraTipoEscuelaBaseService = new CtInfraestructuraTipoEscuelaBaseService();

export class CtInfraestructuraTipoEscuelaBaseController extends BaseController {
  /**
   * 📦 Crear nuevo tipo de escuela
   * @route POST /api/ct_infraestructura_tipo_escuela
   * 🔐 Requiere autenticación
   */
  crearTipoEscuela = async (
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
const tipoEscuelaData: CrearCtInfraestructuraTipoEscuelaInput = req.body;

         return await ctInfraestructuraTipoEscuelaBaseService.crear(tipoEscuelaData, idSesion, idUsuario);
      },
      "Tipo de escuela creado exitosamente"
    );
  };

  /**
   * 📦 Obtener tipo de escuela por ID
   * @route GET /api/ct_infraestructura_tipo_escuela/:id_ct_infraestructura_tipo_escuela
   */
  obtenerTipoEscuelaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_tipo_escuela } = this.validarDatosConEsquema<CtInfraestructuraTipoEscuelaIdParam>(
          ctInfraestructuraTipoEscuelaIdParamSchema,
          req.params
        );

        return await ctInfraestructuraTipoEscuelaBaseService.obtenerPorId(id_ct_infraestructura_tipo_escuela);
      },
      "Tipo de escuela obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los tipos de escuela con filtros y paginación
   * @route GET /api/ct_infraestructura_tipo_escuela
   *
   * Query parameters soportados:
   * - tipo_escuela: Filtrar por tipo de escuela (búsqueda parcial)
   * - clave: Filtrar por clave (búsqueda parcial)
   * - incluir_escuelas: Incluir escuelas relacionadas
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosTiposEscuela = async (
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

        return await ctInfraestructuraTipoEscuelaBaseService.obtenerTodos(filters, pagination);
      },
      "Tipos de escuela obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar tipo de escuela
   * @route PUT /api/ct_infraestructura_tipo_escuela/:id_ct_infraestructura_tipo_escuela
   * 🔐 Requiere autenticación
   */
  actualizarTipoEscuela = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_tipo_escuela } = this.validarDatosConEsquema<CtInfraestructuraTipoEscuelaIdParam>(
          ctInfraestructuraTipoEscuelaIdParamSchema,
          req.params
        );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
        const tipoEscuelaData: ActualizarCtInfraestructuraTipoEscuelaInput = req.body;

        return await ctInfraestructuraTipoEscuelaBaseService.actualizar(id_ct_infraestructura_tipo_escuela, tipoEscuelaData, idSesion, idUsuario);
      },
      "Tipo de escuela actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar tipo de escuela (soft delete)
   * @route DELETE /api/ct_infraestructura_tipo_escuela/:id_ct_infraestructura_tipo_escuela
   * 🔐 Requiere autenticación
   */
  eliminarTipoEscuela = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_tipo_escuela } = this.validarDatosConEsquema<CtInfraestructuraTipoEscuelaIdParam>(
          ctInfraestructuraTipoEscuelaIdParamSchema,
          req.params
        );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInfraestructuraTipoEscuelaBaseService.eliminar(
          id_ct_infraestructura_tipo_escuela,
          idUsuario,
          idSesion
        );
      },
      "Tipo de escuela eliminado exitosamente"
    );
  };
}

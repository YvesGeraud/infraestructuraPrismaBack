import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInventarioEstadoFisicoBaseService } from "../../services/inventario/ct_inventario_estado_fisico.service";
import {
  CrearCtInventarioEstadoFisicoInput,
  ActualizarCtInventarioEstadoFisicoInput,
  ctInventarioEstadoFisicoIdParamSchema,
  CtInventarioEstadoFisicoIdParam,
} from "../../schemas/inventario/ct_inventario_estado_fisico.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_ESTADO_FISICO CON BASE SERVICE =====
const ctInventarioEstadoFisicoBaseService =
  new CtInventarioEstadoFisicoBaseService();

export class CtInventarioEstadoFisicoBaseController extends BaseController {
  /**
   * 📦 Crear nuevo estado físico
   * @route POST /api/ct_inventario_estado_fisico
   * 🔐 Requiere autenticación
   */
  crearInventarioEstadoFisico = async (
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
const inventarioEstadoFisicoData: CrearCtInventarioEstadoFisicoInput =
          req.body;

        return await ctInventarioEstadoFisicoBaseService.crear(
          inventarioEstadoFisicoData,
          idSesion,
          idUsuario
        );
      },
      "Estado físico creado exitosamente"
    );
  };

  /**
   * 📦 Obtener estado físico por ID
   * @route GET /api/ct_inventario_estado_fisico/:id_ct_inventario_estado_fisico
   */
  obtenerInventarioEstadoFisicoPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_estado_fisico } =
          this.validarDatosConEsquema<CtInventarioEstadoFisicoIdParam>(
            ctInventarioEstadoFisicoIdParamSchema,
            req.params
          );

        return await ctInventarioEstadoFisicoBaseService.obtenerPorId(
          id_ct_inventario_estado_fisico
        );
      },
      "Estado físico obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los estados físicos con filtros y paginación
   * @route GET /api/ct_inventario_estado_fisico
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosInventarioEstadoFisicos = async (
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

        return await ctInventarioEstadoFisicoBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Estados físicos obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar estado físico
   * @route PUT /api/ct_inventario_estado_fisico/:id_ct_inventario_estado_fisico
   * 🔐 Requiere autenticación
   */
  actualizarInventarioEstadoFisico = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_estado_fisico } =
          this.validarDatosConEsquema<CtInventarioEstadoFisicoIdParam>(
            ctInventarioEstadoFisicoIdParamSchema,
            req.params
          );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);


        const inventarioEstadoFisicoData: ActualizarCtInventarioEstadoFisicoInput =
          req.body;

        return await ctInventarioEstadoFisicoBaseService.actualizar(
          id_ct_inventario_estado_fisico,
          inventarioEstadoFisicoData,
          idSesion,
          idUsuario
        );
      },
      "Estado físico actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar estado físico (soft delete)
   * @route DELETE /api/ct_inventario_estado_fisico/:id_ct_inventario_estado_fisico
   * 🔐 Requiere autenticación
   */
  eliminarInventarioEstadoFisico = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_estado_fisico } =
          this.validarDatosConEsquema<CtInventarioEstadoFisicoIdParam>(
            ctInventarioEstadoFisicoIdParamSchema,
            req.params
          );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInventarioEstadoFisicoBaseService.eliminar(
          id_ct_inventario_estado_fisico,
          idUsuario,
          idSesion
        );
      },
      "Estado físico eliminado exitosamente"
    );
  };
}

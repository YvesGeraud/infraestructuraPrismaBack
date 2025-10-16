import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInfraestructuraAnexoBaseService } from "../../services/infraestructura/ct_infraestructura_anexo.service";
import {
  CrearCtInfraestructuraAnexoInput,
  ActualizarCtInfraestructuraAnexoInput,
  ctInfraestructuraAnexoIdParamSchema,
  CtInfraestructuraAnexoIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_anexo.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_ANEXO CON BASE SERVICE =====
const ctInfraestructuraAnexoBaseService = new CtInfraestructuraAnexoBaseService();

export class CtInfraestructuraAnexoBaseController extends BaseController {
  /**
   * 📦 Crear nuevo anexo
   * @route POST /api/ct_infraestructura_anexo
   * 🔐 Requiere autenticación
   */
  crearAnexo = async (
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
const anexoData: CrearCtInfraestructuraAnexoInput = req.body;

         return await ctInfraestructuraAnexoBaseService.crear(anexoData, idSesion, idUsuario);
      },
      "Anexo creado exitosamente"
    );
  };

  /**
   * 📦 Obtener anexo por ID
   * @route GET /api/ct_infraestructura_anexo/:id_ct_infraestructura_anexo
   */
  obtenerAnexoPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_anexo } = this.validarDatosConEsquema<CtInfraestructuraAnexoIdParam>(
          ctInfraestructuraAnexoIdParamSchema,
          req.params
        );

        return await ctInfraestructuraAnexoBaseService.obtenerPorId(id_ct_infraestructura_anexo);
      },
      "Anexo obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los anexos con filtros y paginación
   * @route GET /api/ct_infraestructura_anexo
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosAnexos = async (
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

        return await ctInfraestructuraAnexoBaseService.obtenerTodos(filters, pagination);
      },
      "Anexos obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar anexo
   * @route PUT /api/ct_infraestructura_anexo/:id_ct_infraestructura_anexo
   * 🔐 Requiere autenticación
   */
  actualizarAnexo = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_anexo } = this.validarDatosConEsquema<CtInfraestructuraAnexoIdParam>(
          ctInfraestructuraAnexoIdParamSchema,
          req.params
        );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
        const anexoData: ActualizarCtInfraestructuraAnexoInput = req.body;

        return await ctInfraestructuraAnexoBaseService.actualizar(id_ct_infraestructura_anexo, anexoData, idSesion, idUsuario);
      },
      "Anexo actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar anexo (soft delete)
   * @route DELETE /api/ct_infraestructura_anexo/:id_ct_infraestructura_anexo
   * 🔐 Requiere autenticación
   */
  eliminarAnexo = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_anexo } = this.validarDatosConEsquema<CtInfraestructuraAnexoIdParam>(
          ctInfraestructuraAnexoIdParamSchema,
          req.params
        );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInfraestructuraAnexoBaseService.eliminar(
          id_ct_infraestructura_anexo,
          idUsuario,
          idSesion
        );
      },
      "Anexo eliminado exitosamente"
    );
  };
}

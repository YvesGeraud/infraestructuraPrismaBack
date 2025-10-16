import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInfraestructuraJefeSectorBaseService } from "../../services/infraestructura/ct_infraestructura_jefe_sector.service";
import {
  CrearCtInfraestructuraJefeSectorInput,
  ActualizarCtInfraestructuraJefeSectorInput,
  ctInfraestructuraJefeSectorIdParamSchema,
  CtInfraestructuraJefeSectorIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_jefe_sector.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_JEFE_SECTOR CON BASE SERVICE =====
const ctInfraestructuraJefeSectorBaseService = new CtInfraestructuraJefeSectorBaseService();

export class CtInfraestructuraJefeSectorBaseController extends BaseController {
  /**
   * 📦 Crear nuevo jefe de sector
   * @route POST /api/ct_infraestructura_jefe_sector
   * 🔐 Requiere autenticación
   */
  crearJefeSector = async (
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
const jefeSectorData: CrearCtInfraestructuraJefeSectorInput = req.body;

         return await ctInfraestructuraJefeSectorBaseService.crear(jefeSectorData, idSesion, idUsuario);
      },
      "Jefe de sector creado exitosamente"
    );
  };

  /**
   * 📦 Obtener jefe de sector por ID
   * @route GET /api/ct_infraestructura_jefe_sector/:id_ct_infraestructura_jefe_sector
   */
  obtenerJefeSectorPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_jefe_sector } = this.validarDatosConEsquema<CtInfraestructuraJefeSectorIdParam>(
          ctInfraestructuraJefeSectorIdParamSchema,
          req.params
        );

        return await ctInfraestructuraJefeSectorBaseService.obtenerPorId(id_ct_infraestructura_jefe_sector);
      },
      "Jefe de sector obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los jefes de sector con filtros y paginación
   * @route GET /api/ct_infraestructura_jefe_sector
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosJefesSector = async (
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

        return await ctInfraestructuraJefeSectorBaseService.obtenerTodos(filters, pagination);
      },
      "Jefes de sector obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar jefe de sector
   * @route PUT /api/ct_infraestructura_jefe_sector/:id_ct_infraestructura_jefe_sector
   * 🔐 Requiere autenticación
   */
  actualizarJefeSector = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_jefe_sector } = this.validarDatosConEsquema<CtInfraestructuraJefeSectorIdParam>(
          ctInfraestructuraJefeSectorIdParamSchema,
          req.params
        );
        // 🔐 Extraer id_sesion desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
        const jefeSectorData: ActualizarCtInfraestructuraJefeSectorInput = req.body;

        return await ctInfraestructuraJefeSectorBaseService.actualizar(id_ct_infraestructura_jefe_sector, jefeSectorData, idSesion, idUsuario);
      },
      "Jefe de sector actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar jefe de sector (soft delete)
   * @route DELETE /api/ct_infraestructura_jefe_sector/:id_ct_infraestructura_jefe_sector
   * 🔐 Requiere autenticación
   */
  eliminarJefeSector = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_jefe_sector } = this.validarDatosConEsquema<CtInfraestructuraJefeSectorIdParam>(
          ctInfraestructuraJefeSectorIdParamSchema,
          req.params
        );

        // 🔐 Extraer id_sesion e id_usuario desde JWT (OBLIGATORIOS para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInfraestructuraJefeSectorBaseService.eliminar(
          id_ct_infraestructura_jefe_sector,
          idUsuario,
          idSesion
        );
      },
      "Jefe de sector eliminado exitosamente"
    );
  };
}

import { Request, Response } from "express";
import { RequestAutenticado } from "../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../utils/bitacoraUtils";
import { BaseController } from "./BaseController";
import { CtMunicipioBaseService } from "../services/ct_municipio.service";
import {
  CrearCtMunicipioInput,
  ActualizarCtMunicipioInput,
  ctMunicipioIdParamSchema,
  CtMunicipioIdParam,
} from "../schemas/ct_municipio.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_MUNICIPIO CON BASE SERVICE =====
const ctMunicipioBaseService = new CtMunicipioBaseService();

export class CtMunicipioBaseController extends BaseController {
  /**
   * 📦 Crear nuevo municipio
   * @route POST /api/ct_municipio
   * 🔐 Requiere autenticación
   */
  crearMunicipio = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion y id_usuario desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
const municipioData: CrearCtMunicipioInput = req.body;
        return await ctMunicipioBaseService.crear(
          municipioData,
          idSesion,
          idUsuario
        );
      },
      "Municipio creado exitosamente"
    );
  };

  /**
   * 📦 Obtener municipio por ID
   * @route GET /api/ct_municipio/:id_ct_municipio
   */
  obtenerMunicipioPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_municipio } =
          this.validarDatosConEsquema<CtMunicipioIdParam>(
            ctMunicipioIdParamSchema,
            req.params
          );

        return await ctMunicipioBaseService.obtenerPorId(id_ct_municipio);
      },
      "Municipio obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los municipios con filtros y paginación
   * @route GET /api/ct_municipio
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasMunicipios = async (
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

        return await ctMunicipioBaseService.obtenerTodos(filters, pagination);
      },
      "Municipios obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar municipio
   * @route PUT /api/ct_municipio/:id_ct_municipio
   * 🔐 Requiere autenticación
   */
  actualizarMunicipio = async (
    req: RequestAutenticado,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        // 🔐 Extraer id_sesion y id_usuario desde JWT (OBLIGATORIO para bitácora)
        const idSesion = obtenerIdSesionDesdeJwt(req);
        const idUsuario = obtenerIdUsuarioDesdeJwt(req);
const { id_ct_municipio } =
          this.validarDatosConEsquema<CtMunicipioIdParam>(
            ctMunicipioIdParamSchema,
            req.params
          );
        const municipioData: ActualizarCtMunicipioInput = req.body;

        return await ctMunicipioBaseService.actualizar(
          id_ct_municipio,
          municipioData,
          idSesion,
          idUsuario
        );
      },
      "Municipio actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar municipio (soft delete)
   * @route DELETE /api/ct_municipio/:id_ct_municipio
   * 🔐 Requiere autenticación
   */
  eliminarMunicipio = async (
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
const { id_ct_municipio } =
          this.validarDatosConEsquema<CtMunicipioIdParam>(
            ctMunicipioIdParamSchema,
            req.params
          );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctMunicipioBaseService.eliminar(
          id_ct_municipio,
          idSesion,
          idUsuario
        );
      },
      "Municipio eliminado exitosamente"
    );
  };
}

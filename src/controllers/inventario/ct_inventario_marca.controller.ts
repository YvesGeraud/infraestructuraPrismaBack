import { Request, Response } from "express";
import { RequestAutenticado } from "../../middleware/authMiddleware";
import {
  obtenerIdSesionDesdeJwt,
  obtenerIdUsuarioDesdeJwt,
} from "../../utils/bitacoraUtils";
import { BaseController } from "../BaseController";
import { CtInventarioMarcaBaseService } from "../../services/inventario/ct_inventario_marca.service";
import {
  CrearCtInventarioMarcaInput,
  ActualizarCtInventarioMarcaInput,
  ctInventarioMarcaIdParamSchema,
  CtInventarioMarcaIdParam,
} from "../../schemas/inventario/ct_inventario_marca.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INVENTARIO_MARCA CON BASE SERVICE =====
const ctInventarioMarcaBaseService = new CtInventarioMarcaBaseService();

export class CtInventarioMarcaBaseController extends BaseController {
  /**
   * 📦 Crear nueva marca
   * @route POST /api/ct_inventario_marca
   * 🔐 Requiere autenticación
   */
  crearInventarioMarca = async (
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
        const inventarioMarcaData: CrearCtInventarioMarcaInput = req.body;

        return await ctInventarioMarcaBaseService.crear(
          inventarioMarcaData,
          idSesion,
          idUsuario
        );
      },
      "Marca creada exitosamente"
    );
  };

  /**
   * 📦 Obtener marca por ID
   * @route GET /api/ct_inventario_marca/:id_ct_inventario_marca
   */
  obtenerInventarioMarcaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_inventario_marca } =
          this.validarDatosConEsquema<CtInventarioMarcaIdParam>(
            ctInventarioMarcaIdParamSchema,
            req.params
          );

        return await ctInventarioMarcaBaseService.obtenerPorId(
          id_ct_inventario_marca
        );
      },
      "Marca obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las marcas con filtros y paginación
   * @route GET /api/ct_inventario_marca
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasInventarioMarcas = async (
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

        return await ctInventarioMarcaBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Marcas obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar marca
   * @route PUT /api/ct_inventario_marca/:id_ct_inventario_marca
   * 🔐 Requiere autenticación
   */
  actualizarInventarioMarca = async (
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
        const { id_ct_inventario_marca } =
          this.validarDatosConEsquema<CtInventarioMarcaIdParam>(
            ctInventarioMarcaIdParamSchema,
            req.params
          );
        const inventarioMarcaData: ActualizarCtInventarioMarcaInput = req.body;

        return await ctInventarioMarcaBaseService.actualizar(
          id_ct_inventario_marca,
          inventarioMarcaData,
          idSesion,
          idUsuario
        );
      },
      "Marca actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar marca (soft delete)
   * @route DELETE /api/ct_inventario_marca/:id_ct_inventario_marca
   * 🔐 Requiere autenticación
   */
  eliminarInventarioMarca = async (
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
        const { id_ct_inventario_marca } =
          this.validarDatosConEsquema<CtInventarioMarcaIdParam>(
            ctInventarioMarcaIdParamSchema,
            req.params
          );

        // Ya no necesitamos obtener id_ct_usuario_up del body, viene del JWT
        await ctInventarioMarcaBaseService.eliminar(
          id_ct_inventario_marca,
          idUsuario,
          idSesion
        );
      },
      "Marca eliminada exitosamente"
    );
  };
}

import { Request, Response } from "express";
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
   * @route POST /api/inventario/marca
   */
  crearMunicipio = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const municipioData: CrearCtMunicipioInput = req.body;
        return await ctMunicipioBaseService.crear(municipioData);
      },
        "Municipio creado exitosamente"
    );
  };

  /**
   * 📦 Obtener municipio por ID
   * @route GET /api/inventario/entidad/:id_entidad
   */
  obtenerMunicipioPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_municipio } = this.validarDatosConEsquema<CtMunicipioIdParam>(
          ctMunicipioIdParamSchema,
          req.params
        );

            return await ctMunicipioBaseService.obtenerPorId(id_ct_municipio);
      },
      "Municipio obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las municipios con filtros y paginación
   * @route GET /api/inventario/entidad
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
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
   * @route PUT /api/inventario/marca/:id_marca
   */
  actualizarMunicipio = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
            const { id_ct_municipio } = this.validarDatosConEsquema<CtMunicipioIdParam>(
          ctMunicipioIdParamSchema,
          req.params
        );
            const municipioData: ActualizarCtMunicipioInput = req.body;

        return await ctMunicipioBaseService.actualizar(id_ct_municipio, municipioData);
      },
      "Municipio actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar municipio
   * @route DELETE /api/inventario/marca/:id_marca
   */
  eliminarMunicipio = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_municipio } = this.validarDatosConEsquema<CtMunicipioIdParam>(
            ctMunicipioIdParamSchema,
          req.params
        );

        await ctMunicipioBaseService.eliminar(id_ct_municipio);
      },
      "Municipio eliminada exitosamente"
    );
  };
}

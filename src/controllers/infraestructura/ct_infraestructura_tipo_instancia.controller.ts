import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInfraestructuraTipoInstanciaBaseService } from "../../services/infraestructura/ct_infraestructura_tipo_instancia.service";
import {
  CrearCtInfraestructuraTipoInstanciaInput,
  ActualizarCtInfraestructuraTipoInstanciaInput,
  ctInfraestructuraTipoInstanciaIdParamSchema,
  CtInfraestructuraTipoInstanciaIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_tipo_instancia.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_TIPO_INSTANCIA CON BASE SERVICE =====
const ctInfraestructuraTipoInstanciaBaseService = new CtInfraestructuraTipoInstanciaBaseService();

export class CtInfraestructuraTipoInstanciaBaseController extends BaseController {
  /**
   * 📦 Crear nuevo tipo de instancia
   * @route POST /api/ct_infraestructura_tipo_instancia
   */
  crearTipoInstancia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const tipoInstanciaData: CrearCtInfraestructuraTipoInstanciaInput = req.body;
        return await ctInfraestructuraTipoInstanciaBaseService.crear(tipoInstanciaData);
      },
      "Tipo de instancia creado exitosamente"
    );
  };

  /**
   * 📦 Obtener tipo de instancia por ID
   * @route GET /api/ct_infraestructura_tipo_instancia/:id_ct_infraestructura_tipo_instancia
   */
  obtenerTipoInstanciaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_tipo_instancia } = this.validarDatosConEsquema<CtInfraestructuraTipoInstanciaIdParam>(
          ctInfraestructuraTipoInstanciaIdParamSchema,
          req.params
        );

        return await ctInfraestructuraTipoInstanciaBaseService.obtenerPorId(id_ct_infraestructura_tipo_instancia);
      },
      "Tipo de instancia obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los tipos de instancia con filtros y paginación
   * @route GET /api/ct_infraestructura_tipo_instancia
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - incluir_jerarquias: Incluir jerarquías relacionadas
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosTiposInstancia = async (
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

        return await ctInfraestructuraTipoInstanciaBaseService.obtenerTodos(filters, pagination);
      },
      "Tipos de instancia obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar tipo de instancia
   * @route PUT /api/ct_infraestructura_tipo_instancia/:id_ct_infraestructura_tipo_instancia
   */
  actualizarTipoInstancia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_tipo_instancia } = this.validarDatosConEsquema<CtInfraestructuraTipoInstanciaIdParam>(
          ctInfraestructuraTipoInstanciaIdParamSchema,
          req.params
        );
        const tipoInstanciaData: ActualizarCtInfraestructuraTipoInstanciaInput = req.body;

        return await ctInfraestructuraTipoInstanciaBaseService.actualizar(id_ct_infraestructura_tipo_instancia, tipoInstanciaData);
      },
      "Tipo de instancia actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar tipo de instancia
   * @route DELETE /api/ct_infraestructura_tipo_instancia/:id_ct_infraestructura_tipo_instancia
   */
  eliminarTipoInstancia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_tipo_instancia } = this.validarDatosConEsquema<CtInfraestructuraTipoInstanciaIdParam>(
          ctInfraestructuraTipoInstanciaIdParamSchema,
          req.params
        );

        await ctInfraestructuraTipoInstanciaBaseService.eliminar(id_ct_infraestructura_tipo_instancia);
      },
      "Tipo de instancia eliminado exitosamente"
    );
  };
}

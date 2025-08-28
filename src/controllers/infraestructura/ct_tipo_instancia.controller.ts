import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtTipoInstanciaBaseService } from "../../services/infraestructura/ct_tipo_instancia.service";
import {
  CrearCtTipoInstanciaInput,
  ActualizarCtTipoInstanciaInput,
  ctTipoInstanciaIdParamSchema,
  CtTipoInstanciaIdParam,
} from "../../schemas/infraestructura/ct_tipo_instancia.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_TIPO_INSTANCIA CON BASE SERVICE =====
const ctTipoInstanciaBaseService = new CtTipoInstanciaBaseService();

export class CtTipoInstanciaBaseController extends BaseController {
  /**
   * 📦 Crear nueva tipo de instancia
   * @route POST /api/infraestructura/tipo_instancia
   */
  crearTipoInstancia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const tipoInstanciaData: CrearCtTipoInstanciaInput = req.body;
        return await ctTipoInstanciaBaseService.crear(tipoInstanciaData);
      },
      "Tipo de instancia creada exitosamente"
    );
  };

  /**
   * 📦 Obtener tipo de instancia por ID
   * @route GET /api/infraestructura/tipo_instancia/:id_tipo_instancia
   */
  obtenerTipoInstanciaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_tipo_instancia } =
          this.validarDatosConEsquema<CtTipoInstanciaIdParam>(
            ctTipoInstanciaIdParamSchema,
            req.params
          );

        return await ctTipoInstanciaBaseService.obtenerPorId(id_tipo_instancia);
      },
      "Tipo de instancia obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las tipo de instancias con filtros y paginación
   * @route GET /api/infraestructura/tipo_instancia
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasTipoInstancias = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctTipoInstanciaBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Tipo de instancias obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar tipo de instancia
   * @route PUT /api/infraestructura/tipo_instancia/:id_tipo_instancia
   */
  actualizarTipoInstancia = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_tipo_instancia } =
          this.validarDatosConEsquema<CtTipoInstanciaIdParam>(
            ctTipoInstanciaIdParamSchema,
            req.params
          );
        const tipoInstanciaData: ActualizarCtTipoInstanciaInput = req.body;

        return await ctTipoInstanciaBaseService.actualizar(
          id_tipo_instancia,
          tipoInstanciaData
        );
      },
      "Tipo de instancia actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar tipo de instancia
   * @route DELETE /api/infraestructura/tipo_instancia/:id_tipo_instancia
   */
  eliminarTipoInstancia = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_tipo_instancia } =
          this.validarDatosConEsquema<CtTipoInstanciaIdParam>(
            ctTipoInstanciaIdParamSchema,
            req.params
          );

        await ctTipoInstanciaBaseService.eliminar(id_tipo_instancia);
      },
      "Tipo de instancia eliminada exitosamente"
    );
  };
}

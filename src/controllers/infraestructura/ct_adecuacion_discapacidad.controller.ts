import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtAdecuacionDiscapacidadBaseService } from "../../services/infraestructura/ct_adecuacion_discapacidad.service";
import {
  CrearCtAdecuacionDiscapacidadInput,
  ActualizarCtAdecuacionDiscapacidadInput,
  ctAdecuacionDiscapacidadIdParamSchema,
  CtAdecuacionDiscapacidadIdParam,
} from "../../schemas/infraestructura/ct_adecuacion_discapacidad.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_ADECUACION_DISCAPACIDAD CON BASE SERVICE =====
const ctAdecuacionDiscapacidadBaseService =
  new CtAdecuacionDiscapacidadBaseService();

export class CtAdecuacionDiscapacidadBaseController extends BaseController {
  /**
   * 📦 Crear nueva marca
   * @route POST /api/infraestructura/adecuacion_discapacidad
   */
  crearAdecuacionDeDiscapacidad = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const adecuacionDeDiscapacidadData: CrearCtAdecuacionDiscapacidadInput =
          req.body;
        return await ctAdecuacionDiscapacidadBaseService.crear(
          adecuacionDeDiscapacidadData
        );
      },
      "Adecuación de discapacidad creada exitosamente"
    );
  };

  /**
   * 📦 Obtener adecuación de discapacidad por ID
   * @route GET /api/inventario/marca/:id_marca
   */
  obtenerAdecuacionDeDiscapacidadPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_adecuacion } =
          this.validarDatosConEsquema<CtAdecuacionDiscapacidadIdParam>(
            ctAdecuacionDiscapacidadIdParamSchema,
            req.params
          );

        return await ctAdecuacionDiscapacidadBaseService.obtenerPorId(
          id_adecuacion
        );
      },
      "Adecuación de discapacidad obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las adecuaciones de discapacidad con filtros y paginación
   * @route GET /api/inventario/marca
   *
   * Query parameters soportados:
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasAdecuacionesDeDiscapacidad = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await ctAdecuacionDiscapacidadBaseService.obtenerTodos(
          filters,
          pagination
        );
      },
      "Adecuaciones de discapacidad obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar adecuación de discapacidad
   * @route PUT /api/inventario/marca/:id_marca
   */
  actualizarAdecuacionDeDiscapacidad = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_adecuacion } =
          this.validarDatosConEsquema<CtAdecuacionDiscapacidadIdParam>(
            ctAdecuacionDiscapacidadIdParamSchema,
            req.params
          );
        const adecuacionDeDiscapacidadData: ActualizarCtAdecuacionDiscapacidadInput =
          req.body;

        return await ctAdecuacionDiscapacidadBaseService.actualizar(
          id_adecuacion,
          adecuacionDeDiscapacidadData
        );
      },
      "Adecuación de discapacidad actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar adecuación de discapacidad
   * @route DELETE /api/inventario/marca/:id_marca
   */
  eliminarAdecuacionDeDiscapacidad = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_adecuacion } =
          this.validarDatosConEsquema<CtAdecuacionDiscapacidadIdParam>(
            ctAdecuacionDiscapacidadIdParamSchema,
            req.params
          );

        await ctAdecuacionDiscapacidadBaseService.eliminar(id_adecuacion);
      },
      "Adecuación de discapacidad eliminada exitosamente"
    );
  };
}

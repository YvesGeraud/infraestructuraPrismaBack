import { Request, Response } from "express";
import { BaseController } from "./BaseController";
import { CtBitacoraTablaBaseService } from "../services/ct_bitacora_tabla.service";
import {
  CrearCtBitacoraTablaInput,
  ActualizarCtBitacoraTablaInput,
  ctBitacoraTablaIdParamSchema,
  CtBitacoraTablaIdParam,
} from "../schemas/ct_bitacora_tabla.schema";
import { PaginationInput } from "../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_BITACORA_TABLA CON BASE SERVICE =====
const ctBitacoraTablaBaseService = new CtBitacoraTablaBaseService();

export class CtBitacoraTablaBaseController extends BaseController {
  /**
   * 📦 Crear nueva tabla de bitácora
   * @route POST /api/ct_bitacora_tabla
   */
  crearBitacoraTabla = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const bitacoraTablaData: CrearCtBitacoraTablaInput = req.body;
        return await ctBitacoraTablaBaseService.crear(bitacoraTablaData);
      },
      "Tabla de bitácora creada exitosamente"
    );
  };

  /**
   * 📦 Obtener tabla de bitácora por ID
   * @route GET /api/ct_bitacora_tabla/:id_ct_bitacora_tabla
   */
  obtenerBitacoraTablaPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_bitacora_tabla } = this.validarDatosConEsquema<CtBitacoraTablaIdParam>(
          ctBitacoraTablaIdParamSchema,
          req.params
        );

        return await ctBitacoraTablaBaseService.obtenerPorId(id_ct_bitacora_tabla);
      },
      "Tabla de bitácora obtenida exitosamente"
    );
  };

  /**
   * 📦 Obtener todas las tablas de bitácora con filtros y paginación
   * @route GET /api/ct_bitacora_tabla
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - descripcion: Filtrar por descripción (búsqueda parcial)
   * - auditar: Filtrar por bandera de auditoría
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodasLasBitacorasTabla = async (
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

        return await ctBitacoraTablaBaseService.obtenerTodos(filters, pagination);
      },
      "Tablas de bitácora obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar tabla de bitácora
   * @route PUT /api/ct_bitacora_tabla/:id_ct_bitacora_tabla
   */
  actualizarBitacoraTabla = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_bitacora_tabla } = this.validarDatosConEsquema<CtBitacoraTablaIdParam>(
          ctBitacoraTablaIdParamSchema,
          req.params
        );
        const bitacoraTablaData: ActualizarCtBitacoraTablaInput = req.body;

        return await ctBitacoraTablaBaseService.actualizar(id_ct_bitacora_tabla, bitacoraTablaData);
      },
      "Tabla de bitácora actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar tabla de bitácora
   * @route DELETE /api/ct_bitacora_tabla/:id_ct_bitacora_tabla
   */
  eliminarBitacoraTabla = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_bitacora_tabla } = this.validarDatosConEsquema<CtBitacoraTablaIdParam>(
          ctBitacoraTablaIdParamSchema,
          req.params
        );

        await ctBitacoraTablaBaseService.eliminar(id_ct_bitacora_tabla);
      },
      "Tabla de bitácora eliminada exitosamente"
    );
  };
}


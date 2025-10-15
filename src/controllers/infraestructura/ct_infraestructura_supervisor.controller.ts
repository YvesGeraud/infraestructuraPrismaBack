import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInfraestructuraSupervisorBaseService } from "../../services/infraestructura/ct_infraestructura_supervisor.service";
import {
  CrearCtInfraestructuraSupervisorInput,
  ActualizarCtInfraestructuraSupervisorInput,
  ctInfraestructuraSupervisorIdParamSchema,
  CtInfraestructuraSupervisorIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_supervisor.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_SUPERVISOR CON BASE SERVICE =====
const ctInfraestructuraSupervisorBaseService = new CtInfraestructuraSupervisorBaseService();

export class CtInfraestructuraSupervisorBaseController extends BaseController {
  /**
   * 📦 Crear nuevo supervisor
   * @route POST /api/ct_infraestructura_supervisor
   */
  crearSupervisor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const supervisorData: CrearCtInfraestructuraSupervisorInput = req.body;
        return await ctInfraestructuraSupervisorBaseService.crear(supervisorData);
      },
      "Supervisor creado exitosamente"
    );
  };

  /**
   * 📦 Obtener supervisor por ID
   * @route GET /api/ct_infraestructura_supervisor/:id_ct_infraestructura_supervisor
   */
  obtenerSupervisorPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_supervisor } = this.validarDatosConEsquema<CtInfraestructuraSupervisorIdParam>(
          ctInfraestructuraSupervisorIdParamSchema,
          req.params
        );

        return await ctInfraestructuraSupervisorBaseService.obtenerPorId(id_ct_infraestructura_supervisor);
      },
      "Supervisor obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los supervisores con filtros y paginación
   * @route GET /api/ct_infraestructura_supervisor
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosSupervisores = async (
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

        return await ctInfraestructuraSupervisorBaseService.obtenerTodos(filters, pagination);
      },
      "Supervisores obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar supervisor
   * @route PUT /api/ct_infraestructura_supervisor/:id_ct_infraestructura_supervisor
   */
  actualizarSupervisor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_supervisor } = this.validarDatosConEsquema<CtInfraestructuraSupervisorIdParam>(
          ctInfraestructuraSupervisorIdParamSchema,
          req.params
        );
        const supervisorData: ActualizarCtInfraestructuraSupervisorInput = req.body;

        return await ctInfraestructuraSupervisorBaseService.actualizar(id_ct_infraestructura_supervisor, supervisorData);
      },
      "Supervisor actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar supervisor
   * @route DELETE /api/ct_infraestructura_supervisor/:id_ct_infraestructura_supervisor
   */
  eliminarSupervisor = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_supervisor } = this.validarDatosConEsquema<CtInfraestructuraSupervisorIdParam>(
          ctInfraestructuraSupervisorIdParamSchema,
          req.params
        );

        await ctInfraestructuraSupervisorBaseService.eliminar(id_ct_infraestructura_supervisor);
      },
      "Supervisor eliminado exitosamente"
    );
  };
}

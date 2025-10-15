import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { CtInfraestructuraDepartamentoBaseService } from "../../services/infraestructura/ct_infraestructura_departamento.service";
import {
  CrearCtInfraestructuraDepartamentoInput,
  ActualizarCtInfraestructuraDepartamentoInput,
  ctInfraestructuraDepartamentoIdParamSchema,
  CtInfraestructuraDepartamentoIdParam,
} from "../../schemas/infraestructura/ct_infraestructura_departamento.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA CT_INFRAESTRUCTURA_DEPARTAMENTO CON BASE SERVICE =====
const ctInfraestructuraDepartamentoBaseService = new CtInfraestructuraDepartamentoBaseService();

export class CtInfraestructuraDepartamentoBaseController extends BaseController {
  /**
   * 📦 Crear nuevo departamento
   * @route POST /api/ct_infraestructura_departamento
   */
  crearDepartamento = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const departamentoData: CrearCtInfraestructuraDepartamentoInput = req.body;
        return await ctInfraestructuraDepartamentoBaseService.crear(departamentoData);
      },
      "Departamento creado exitosamente"
    );
  };

  /**
   * 📦 Obtener departamento por ID
   * @route GET /api/ct_infraestructura_departamento/:id_ct_infraestructura_departamento
   */
  obtenerDepartamentoPorId = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_departamento } = this.validarDatosConEsquema<CtInfraestructuraDepartamentoIdParam>(
          ctInfraestructuraDepartamentoIdParamSchema,
          req.params
        );

        return await ctInfraestructuraDepartamentoBaseService.obtenerPorId(id_ct_infraestructura_departamento);
      },
      "Departamento obtenido exitosamente"
    );
  };

  /**
   * 📦 Obtener todos los departamentos con filtros y paginación
   * @route GET /api/ct_infraestructura_departamento
   *
   * Query parameters soportados:
   * - nombre: Filtrar por nombre (búsqueda parcial)
   * - cct: Filtrar por CCT (búsqueda parcial)
   * - id_dt_infraestructura_ubicacion: Filtrar por ubicación
   * - incluir_ubicacion: Incluir datos de la ubicación
   * - pagina: Número de página (default: 1)
   * - limite: Elementos por página (default: 10)
   */
  obtenerTodosLosDepartamentos = async (
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

        return await ctInfraestructuraDepartamentoBaseService.obtenerTodos(filters, pagination);
      },
      "Departamentos obtenidos exitosamente"
    );
  };

  /**
   * 📦 Actualizar departamento
   * @route PUT /api/ct_infraestructura_departamento/:id_ct_infraestructura_departamento
   */
  actualizarDepartamento = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_departamento } = this.validarDatosConEsquema<CtInfraestructuraDepartamentoIdParam>(
          ctInfraestructuraDepartamentoIdParamSchema,
          req.params
        );
        const departamentoData: ActualizarCtInfraestructuraDepartamentoInput = req.body;

        return await ctInfraestructuraDepartamentoBaseService.actualizar(id_ct_infraestructura_departamento, departamentoData);
      },
      "Departamento actualizado exitosamente"
    );
  };

  /**
   * 📦 Eliminar departamento
   * @route DELETE /api/ct_infraestructura_departamento/:id_ct_infraestructura_departamento
   */
  eliminarDepartamento = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_ct_infraestructura_departamento } = this.validarDatosConEsquema<CtInfraestructuraDepartamentoIdParam>(
          ctInfraestructuraDepartamentoIdParamSchema,
          req.params
        );

        await ctInfraestructuraDepartamentoBaseService.eliminar(id_ct_infraestructura_departamento);
      },
      "Departamento eliminado exitosamente"
    );
  };
}

import { Request, Response } from "express";
import { BaseController } from "../BaseController";
import { RlJerarquiaBaseService } from "../../services/infraestructura/rl_jerarquia.service";
import {
  ActualizarRlJerarquiaInput,
  CrearRlJerarquiaInput,
  rlJerarquiaIdParamSchema,
  RlJerarquiaIdParam,
} from "../../schemas/infraestructura/rl_jerarquia.schema";
import { PaginationInput } from "../../schemas/commonSchemas";

//TODO ===== CONTROLADOR PARA RL_JERARQUIA CON BASE SERVICE =====
const rlJerarquiaBaseService = new RlJerarquiaBaseService();

export class RlJerarquiaBaseController extends BaseController {
  /**
   * 📦 Crear nueva jerarquía
   * @route POST /api/infraestructura/jerarquia
   */
  crearJerarquia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarCreacion(
      req,
      res,
      async () => {
        const jerarquiaData: CrearRlJerarquiaInput = req.body;
        return await rlJerarquiaBaseService.crear(jerarquiaData);
      },
      "Jerarquía creada exitosamente"
    );
  };

  /**
   * 📦 Obtener jerarquía por ID
   * @route GET /api/infraestructura/jerarquia/:id_jerarquia
   */
  obtenerJerarquiaPorId = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );

        return await rlJerarquiaBaseService.obtenerPorId(id_jerarquia);
      },
      "Jerarquía obtenida exitosamente"
    );
  };

  obtenerTodasLasJerarquias = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarListaPaginada(
      req,
      res,
      async () => {
        const filters = req.query as any;
        const pagination: PaginationInput = req.query as any;

        return await rlJerarquiaBaseService.obtenerTodos(filters, pagination);
      },
      "Jerarquías obtenidas exitosamente"
    );
  };

  /**
   * 📦 Actualizar jerarquía
   * @route PUT /api/infraestructura/jerarquia/:id_jerarquia
   */
  actualizarJerarquia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarActualizacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );
        const jerarquiaData: ActualizarRlJerarquiaInput = req.body;

        return await rlJerarquiaBaseService.actualizar(
          id_jerarquia,
          jerarquiaData
        );
      },
      "Jerarquía actualizada exitosamente"
    );
  };

  /**
   * 📦 Eliminar jerarquía
   * @route DELETE /api/infraestructura/jerarquia/:id_jerarquia
   */
  eliminarJerarquia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarEliminacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );

        await rlJerarquiaBaseService.eliminar(id_jerarquia);
      },
      "Jerarquía eliminada exitosamente"
    );
  };

  // ========== MÉTODOS ESPECÍFICOS DE JERARQUÍA ==========

  /**
   * 🔗 Obtener ruta completa de jerarquía desde un nodo hasta la raíz
   * @route GET /api/infraestructura/jerarquia/:id_jerarquia/ruta
   * @param id_jerarquia ID del nodo del cual obtener la ruta
   * @returns Array de nodos desde la raíz hasta el nodo especificado
   */
  obtenerRutaJerarquia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );

        return await rlJerarquiaBaseService.obtenerRuta(id_jerarquia);
      },
      "Ruta de jerarquía obtenida exitosamente"
    );
  };

  /**
   * 🌳 Obtener todos los hijos directos de un nodo
   * @route GET /api/infraestructura/jerarquia/:id_jerarquia/hijos
   * @param id_jerarquia ID del nodo padre
   * @returns Array de nodos hijos directos
   */
  obtenerHijosJerarquia = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );

        return await rlJerarquiaBaseService.obtenerHijos(id_jerarquia);
      },
      "Hijos de jerarquía obtenidos exitosamente"
    );
  };

  /**
   * 🌲 Obtener árbol completo desde un nodo (recursivo)
   * @route GET /api/infraestructura/jerarquia/:id_jerarquia/arbol?profundidad=5
   * @param id_jerarquia ID del nodo raíz
   * @param profundidad Profundidad máxima del árbol (query param, default: 10)
   * @returns Nodo con todos sus descendientes anidados hasta la profundidad especificada
   */
  obtenerArbolJerarquia = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );

        // Obtener profundidad del query param (default: 10)
        const profundidad = req.query.profundidad
          ? parseInt(req.query.profundidad as string, 10)
          : 10;

        // Validar que la profundidad sea razonable
        if (profundidad < 1 || profundidad > 50) {
          throw new Error("La profundidad debe estar entre 1 y 50");
        }

        return await rlJerarquiaBaseService.obtenerArbolDesdeNodo(
          id_jerarquia,
          profundidad
        );
      },
      "Árbol de jerarquía obtenido exitosamente"
    );
  };

  /**
   * 🎯 Obtener nodo específico con información completa
   * @route GET /api/infraestructura/jerarquia/:id_jerarquia/nodo
   * @param id_jerarquia ID del nodo
   * @returns Nodo con información de tipo de instancia
   */
  obtenerNodoJerarquia = async (req: Request, res: Response): Promise<void> => {
    await this.manejarOperacion(
      req,
      res,
      async () => {
        const { id_jerarquia } =
          this.validarDatosConEsquema<RlJerarquiaIdParam>(
            rlJerarquiaIdParamSchema,
            req.params
          );

        return await rlJerarquiaBaseService.obtenerNodoPorId(id_jerarquia);
      },
      "Nodo de jerarquía obtenido exitosamente"
    );
  };
}

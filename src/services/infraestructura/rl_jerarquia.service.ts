/**
 * @fileoverview Servicio de rl_infraestructura_jerarquia usando BaseService
 * Ejemplo de tabla de relación (rl_) con includes y filtros específicos
 */

import { BaseService } from "../BaseService";
import { Rl_infraestructura_jerarquia } from "@prisma/client";
import {
  CrearRlJerarquiaInput,
  ActualizarRlJerarquiaInput,
  BuscarJerarquiasInput,
} from "../../schemas/infraestructura/rl_jerarquia.schema";

/**
 * Interfaz para nodos de jerarquía con información completa
 * Migrada del sistema Sequelize al nuevo sistema Prisma
 */
export interface NodoJerarquia {
  id_jerarquia: number;
  id_instancia: number;
  id_tipo_instancia: number;
  id_dependencia?: number | null;
  fecha_in?: Date | null;
  usuario_in?: number | null;
  tipo_instancia?: {
    id_tipo: number;
    descripcion?: string;
  };
  padre?: NodoJerarquia | null;
  hijos?: NodoJerarquia[];
  nivel?: number;
  ruta?: string;
}

//TODO ===== SERVICIO PARA RL_JERARQUIA CON BASE SERVICE =====

export class RlJerarquiaBaseService extends BaseService<
  Rl_infraestructura_jerarquia,
  CrearRlJerarquiaInput,
  ActualizarRlJerarquiaInput,
  BuscarJerarquiasInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "rl_infraestructura_jerarquia",
    defaultOrderBy: { id_jerarquia: "asc" as const },
  };

  // 🔗 Includes reales según schema de Prisma
  protected configurarIncludes(filters?: BuscarJerarquiasInput) {
    return {
      ct_infraestructura_tipo_instancia: true, // Relación directa
    };
  }

  // 🔍 Filtros específicos para jerarquías de relación
  protected construirWhereClause(filters?: BuscarJerarquiasInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por instancia (número exacto)
    if (filters?.id_instancia) {
      conditions.push({
        id_instancia: filters.id_instancia,
      });
    }

    // Filtro por tipo de instancia (número exacto)
    if (filters?.id_tipo_instancia) {
      conditions.push({
        id_tipo_instancia: filters.id_tipo_instancia,
      });
    }

    // Filtro por dependencia (número exacto)
    if (filters?.id_dependencia) {
      conditions.push({
        id_dependencia: filters.id_dependencia,
      });
    }

    // Si hay condiciones, usar AND
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // ✅ NO necesitamos getPrimaryKeyField() - algoritmo inteligente detecta: id_jerarquia

  // ========== MÉTODOS ESPECÍFICOS DE JERARQUÍA ==========

  /**
   * Obtener un nodo específico por ID con sus relaciones
   * Migrado del sistema Sequelize
   */
  async obtenerNodoPorId(id: number): Promise<NodoJerarquia | null> {
    try {
      const nodo = await this.model.findUnique({
        where: { id_jerarquia: id },
        include: {
          ct_infraestructura_tipo_instancia: {
            select: {
              id_tipo: true,
              descripcion: true,
            },
          },
        },
      });

      if (!nodo) {
        return null;
      }

      // Mapear el resultado de Prisma a la interfaz NodoJerarquia
      return {
        id_jerarquia: nodo.id_jerarquia,
        id_instancia: nodo.id_instancia,
        id_tipo_instancia: nodo.id_tipo_instancia,
        id_dependencia: nodo.id_dependencia,
        fecha_in: nodo.fecha_in,
        usuario_in: nodo.usuario_in,
        tipo_instancia: nodo.ct_infraestructura_tipo_instancia
          ? {
              id_tipo: nodo.ct_infraestructura_tipo_instancia.id_tipo,
              descripcion: nodo.ct_infraestructura_tipo_instancia.descripcion,
            }
          : undefined,
      };
    } catch (error) {
      throw new Error(
        `Error al obtener nodo por ID: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Obtener la ruta completa desde un nodo hasta la raíz
   * Migrado del sistema Sequelize - ¡FUNCIONALIDAD CLAVE!
   * @param idNodo ID del nodo inicial
   * @returns Array de nodos desde la raíz hasta el nodo especificado
   * @throws Error si el nodo no existe o hay problemas de conectividad
   */
  async obtenerRuta(idNodo: number): Promise<NodoJerarquia[]> {
    try {
      const ruta: NodoJerarquia[] = [];
      let nodoActual = await this.obtenerNodoPorId(idNodo);

      // Validar que el nodo inicial existe
      if (!nodoActual) {
        throw new Error(`Nodo con ID ${idNodo} no encontrado`);
      }

      // Protección contra ciclos infinitos
      const visitados = new Set<number>();

      // Recorrer hacia arriba hasta llegar a la raíz
      while (nodoActual) {
        // Detectar ciclos en la jerarquía
        if (visitados.has(nodoActual.id_jerarquia)) {
          throw new Error(
            `Ciclo detectado en la jerarquía: nodo ${nodoActual.id_jerarquia} ya visitado`
          );
        }
        visitados.add(nodoActual.id_jerarquia);

        ruta.unshift(nodoActual); // Agregar al inicio para mantener orden jerárquico

        // Subir al nodo padre si existe
        if (nodoActual.id_dependencia) {
          nodoActual = await this.obtenerNodoPorId(nodoActual.id_dependencia);
        } else {
          nodoActual = null; // Llegamos a la raíz
        }
      }

      return ruta;
    } catch (error) {
      throw new Error(
        `Error al obtener ruta: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Obtener todos los hijos directos de un nodo
   * Método útil para construcción de árboles
   */
  async obtenerHijos(idPadre: number): Promise<NodoJerarquia[]> {
    try {
      const hijos = await this.model.findMany({
        where: { id_dependencia: idPadre },
        include: {
          ct_infraestructura_tipo_instancia: {
            select: {
              id_tipo: true,
              descripcion: true,
            },
          },
        },
        orderBy: { id_jerarquia: "asc" },
      });

      // Mapear los resultados
      return hijos.map((hijo: any) => ({
        id_jerarquia: hijo.id_jerarquia,
        id_instancia: hijo.id_instancia,
        id_tipo_instancia: hijo.id_tipo_instancia,
        id_dependencia: hijo.id_dependencia,
        fecha_in: hijo.fecha_in,
        usuario_in: hijo.usuario_in,
        tipo_instancia: hijo.ct_infraestructura_tipo_instancia
          ? {
              id_tipo: hijo.ct_infraestructura_tipo_instancia.id_tipo,
              descripcion: hijo.ct_infraestructura_tipo_instancia.descripcion,
            }
          : undefined,
      }));
    } catch (error) {
      throw new Error(
        `Error al obtener hijos: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Obtener el árbol completo desde un nodo hacia abajo
   * Útil para visualización de jerarquías
   * @param idRaiz ID del nodo raíz
   * @param maxProfundidad Profundidad máxima para evitar recursión excesiva (default: 10)
   * @param profundidadActual Profundidad actual (para uso interno)
   * @returns Nodo con todos sus descendientes anidados hasta la profundidad especificada
   * @throws Error si el nodo no existe o se excede la profundidad máxima
   */
  async obtenerArbolDesdeNodo(
    idRaiz: number,
    maxProfundidad: number = 10,
    profundidadActual: number = 0
  ): Promise<NodoJerarquia> {
    // Protección contra recursión excesiva
    if (profundidadActual > maxProfundidad) {
      throw new Error(
        `Profundidad máxima excedida (${maxProfundidad}) al construir árbol desde nodo ${idRaiz}`
      );
    }

    const nodoRaiz = await this.obtenerNodoPorId(idRaiz);
    if (!nodoRaiz) {
      throw new Error(`Nodo con ID ${idRaiz} no encontrado`);
    }

    // Agregar información de nivel
    nodoRaiz.nivel = profundidadActual;

    // Obtener hijos directos
    const hijos = await this.obtenerHijos(idRaiz);
    nodoRaiz.hijos = [];

    // Procesar hijos recursivamente solo si no hemos alcanzado la profundidad máxima
    if (profundidadActual < maxProfundidad) {
      for (const hijo of hijos) {
        const hijoConDescendientes = await this.obtenerArbolDesdeNodo(
          hijo.id_jerarquia,
          maxProfundidad,
          profundidadActual + 1
        );
        nodoRaiz.hijos.push(hijoConDescendientes);
      }
    }

    return nodoRaiz;
  }

  // ========== MÉTODOS ADICIONALES DE OPTIMIZACIÓN ==========

  /**
   * Validar la integridad de la jerarquía (detectar nodos huérfanos o ciclos)
   * Útil para diagnóstico y mantenimiento
   * @returns Reporte de integridad con problemas encontrados
   */
  async validarIntegridadJerarquia(): Promise<{
    nodosSinPadre: number[];
    nodosHuerfanos: number[];
    ciclosDetectados: number[][];
  }> {
    try {
      const todosLosNodos = await this.model.findMany({
        select: {
          id_jerarquia: true,
          id_dependencia: true,
        },
      });

      const nodosSinPadre: number[] = [];
      const nodosHuerfanos: number[] = [];
      const ciclosDetectados: number[][] = [];

      // Buscar nodos sin padre válido
      for (const nodo of todosLosNodos) {
        if (nodo.id_dependencia) {
          const padreExiste = todosLosNodos.some(
            (n: { id_jerarquia: number; id_dependencia: number | null }) =>
              n.id_jerarquia === nodo.id_dependencia
          );
          if (!padreExiste) {
            nodosHuerfanos.push(nodo.id_jerarquia);
          }
        } else {
          nodosSinPadre.push(nodo.id_jerarquia);
        }
      }

      // Detectar ciclos básicos (se puede mejorar con algoritmo más sofisticado)
      for (const nodo of todosLosNodos) {
        if (nodo.id_dependencia === nodo.id_jerarquia) {
          ciclosDetectados.push([nodo.id_jerarquia]);
        }
      }

      return {
        nodosSinPadre,
        nodosHuerfanos,
        ciclosDetectados,
      };
    } catch (error) {
      throw new Error(
        `Error al validar integridad: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }

  /**
   * Construir mapa de rutas en lote (optimización para múltiples consultas)
   * Útil cuando necesitas las rutas de muchos nodos
   * @param idsNodos Array de IDs de nodos
   * @returns Map con id_nodo → ruta completa
   */
  async construirMapaRutas(
    idsNodos: number[]
  ): Promise<Map<number, NodoJerarquia[]>> {
    const mapaRutas = new Map<number, NodoJerarquia[]>();

    // Cache para evitar consultas repetidas
    const cacheNodos = new Map<number, NodoJerarquia | null>();

    for (const idNodo of idsNodos) {
      try {
        const ruta = await this.obtenerRuta(idNodo);
        mapaRutas.set(idNodo, ruta);
      } catch (error) {
        // Si un nodo falla, continuamos con los demás
        console.warn(`Error obteniendo ruta para nodo ${idNodo}:`, error);
        mapaRutas.set(idNodo, []);
      }
    }

    return mapaRutas;
  }
}

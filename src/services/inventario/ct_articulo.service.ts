/**
 * @fileoverview Servicio de ct_articulo usando BaseService
 */

import { BaseService } from "../BaseService";
import { Ct_inventario_articulo } from "@prisma/client";
import {
  CrearCtArticuloInput,
  ActualizarCtArticuloInput,
  BuscarArticulosInput,
} from "../../schemas/inventario/ct_articulo.schema";

//TODO ===== SERVICIO PARA CT_ARTICULO CON BASE SERVICE =====

export class CtArticuloBaseService extends BaseService<
  Ct_inventario_articulo,
  CrearCtArticuloInput,
  ActualizarCtArticuloInput,
  BuscarArticulosInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_articulo",
    defaultOrderBy: { id_articulo: "asc" as const },
  };

  // 🔗 Includes condicionales para artículos
  protected configurarIncludes(filters?: BuscarArticulosInput) {
    const includes: any = {};

    // Incluir jerarquía si se solicita
    if (filters?.incluir_jerarquia) {
      includes.rl_infraestructura_jerarquia = {
        include: {
          ct_infraestructura_tipo_instancia: true,
        },
      };
    }

    // Incluir marca si se solicita
    if (filters?.incluir_marca) {
      includes.ct_inventario_marca = true;
    }

    // Incluir color si se solicita
    if (filters?.incluir_color) {
      includes.ct_inventario_color = true;
    }

    // Incluir material si se solicita
    if (filters?.incluir_material) {
      includes.ct_inventario_material = true;
    }

    // Incluir proveedor si se solicita
    if (filters?.incluir_proveedor) {
      includes.ct_inventario_proveedor = true;
    }

    // Incluir subclase si se solicita
    if (filters?.incluir_subclase) {
      includes.ct_inventario_subclase = true;
    }

    // Incluir estado físico si se solicita
    if (filters?.incluir_estado_fisico) {
      includes.ct_inventario_estado_fisico = true;
    }

    // Incluir acción si se solicita
    if (filters?.incluir_accion) {
      includes.ct_accion = true;
    }

    // Incluir todo si se solicita detalle completo
    if (filters?.incluir_detalle_completo) {
      return {
        rl_infraestructura_jerarquia: {
          include: {
            ct_infraestructura_tipo_instancia: true,
          },
        },
        ct_inventario_marca: true,
        ct_inventario_color: true,
        ct_inventario_material: true,
        ct_inventario_proveedor: true,
        ct_inventario_subclase: true,
        ct_inventario_estado_fisico: true,
        ct_accion: true,
        ct_inventario_consecutivo: true,
      };
    }

    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para artículos
  protected construirWhereClause(filters?: BuscarArticulosInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtros de texto
    if (filters?.folio) {
      conditions.push({
        folio: { contains: filters.folio },
      });
    }

    if (filters?.folio_nuevo) {
      conditions.push({
        folio_nuevo: { contains: filters.folio_nuevo },
      });
    }

    if (filters?.no_serie) {
      conditions.push({
        no_serie: { contains: filters.no_serie },
      });
    }

    if (filters?.modelo) {
      conditions.push({
        modelo: { contains: filters.modelo },
      });
    }

    if (filters?.cct) {
      conditions.push({
        cct: { contains: filters.cct },
      });
    }

    // Filtros por IDs
    if (filters?.id_jerarquia) {
      conditions.push({
        id_jerarquia: filters.id_jerarquia,
      });
    }

    if (filters?.id_subclase) {
      conditions.push({
        id_subclase: filters.id_subclase,
      });
    }

    if (filters?.id_marca) {
      conditions.push({
        id_marca: filters.id_marca,
      });
    }

    if (filters?.id_material) {
      conditions.push({
        id_material: filters.id_material,
      });
    }

    if (filters?.id_color) {
      conditions.push({
        id_color: filters.id_color,
      });
    }

    if (filters?.id_proveedor) {
      conditions.push({
        id_proveedor: filters.id_proveedor,
      });
    }

    if (filters?.id_accion) {
      conditions.push({
        id_accion: filters.id_accion,
      });
    }

    if (filters?.id_estado_fisico) {
      conditions.push({
        id_estado_fisico: filters.id_estado_fisico,
      });
    }

    if (filters?.estatus !== undefined) {
      conditions.push({
        estatus: filters.estatus,
      });
    }

    // Filtros de fecha
    if (filters?.fecha_alta_desde) {
      conditions.push({
        fecha_alta: { gte: filters.fecha_alta_desde },
      });
    }

    if (filters?.fecha_alta_hasta) {
      conditions.push({
        fecha_alta: { lte: filters.fecha_alta_hasta },
      });
    }

    if (filters?.fecha_baja_desde) {
      conditions.push({
        fecha_baja: { gte: filters.fecha_baja_desde },
      });
    }

    if (filters?.fecha_baja_hasta) {
      conditions.push({
        fecha_baja: { lte: filters.fecha_baja_hasta },
      });
    }

    // Si hay condiciones, usar AND
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // ========== MÉTODOS ESPECÍFICOS PARA REPORTES ==========

  /**
   * Obtener artículos para reporte por jerarquía
   * @param idJerarquia ID de la jerarquía
   * @returns Artículos con información completa para reporte
   */
  async obtenerArticulosParaReportePorJerarquia(idJerarquia: number) {
    try {
      const articulos = await this.model.findMany({
        where: {
          id_jerarquia: idJerarquia,
        },
        include: {
          rl_infraestructura_jerarquia: {
            include: {
              ct_infraestructura_tipo_instancia: true,
            },
          },
          ct_inventario_marca: true,
          ct_inventario_color: true,
          ct_inventario_material: true,
          ct_inventario_proveedor: true,
          ct_inventario_subclase: true,
          ct_inventario_estado_fisico: true,
          ct_accion: true,
          ct_inventario_consecutivo: true,
        },
        orderBy: {
          folio: "asc",
        },
      });

      return articulos;
    } catch (error) {
      throw new Error(
        `Error al obtener artículos para reporte: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
    }
  }
}

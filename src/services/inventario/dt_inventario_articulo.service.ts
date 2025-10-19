/**
 * @fileoverview Servicio de dt_inventario_articulo usando BaseService
 * Tabla principal de artículos de inventario con múltiples relaciones
 */

import { BaseService } from "../BaseService";
import { dt_inventario_articulo } from "@prisma/client";
import {
  CrearDtInventarioArticuloInput,
  ActualizarDtInventarioArticuloInput,
  BuscarDtInventarioArticuloInput,
} from "../../schemas/inventario/dt_inventario_articulo.schema";

//TODO ===== SERVICIO PARA DT_INVENTARIO_ARTICULO CON BASE SERVICE =====

export class DtInventarioArticuloBaseService extends BaseService<
  dt_inventario_articulo,
  CrearDtInventarioArticuloInput,
  ActualizarDtInventarioArticuloInput,
  BuscarDtInventarioArticuloInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "dt_inventario_articulo",
    defaultOrderBy: { id_dt_inventario_articulo: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarDtInventarioArticuloInput) {
    const includes: any = {};

    // Include individual de color
    if (filters?.incluir_color) {
      includes.ct_inventario_color = true;
    }

    // Include individual de estado físico
    if (filters?.incluir_estado_fisico) {
      includes.ct_inventario_estado_fisico = true;
    }

    // Include individual de marca
    if (filters?.incluir_marca) {
      includes.ct_inventario_marca = true;
    }

    // Include individual de material
    if (filters?.incluir_material) {
      includes.ct_inventario_material = true;
    }

    // Include individual de proveedor
    if (filters?.incluir_proveedor) {
      includes.ct_inventario_proveedor = true;
    }

    // Include individual de tipo de artículo
    if (filters?.incluir_tipo_articulo) {
      includes.ct_inventario_tipo_articulo = true;
    }

    // Include individual de jerarquía
    if (filters?.incluir_jerarquia) {
      includes.rl_infraestructura_jerarquia = true;
    }

    // Include de todas las relaciones
    if (filters?.incluir_todas_relaciones) {
      includes.ct_inventario_color = true;
      includes.ct_inventario_estado_fisico = true;
      includes.ct_inventario_marca = true;
      includes.ct_inventario_material = true;
      includes.ct_inventario_proveedor = true;
      includes.ct_inventario_tipo_articulo = true;
      includes.rl_infraestructura_jerarquia = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para artículos de inventario
  protected construirWhereClause(filters?: BuscarDtInventarioArticuloInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_dt_inventario_articulo) {
      conditions.push({
        id_dt_inventario_articulo: filters.id_dt_inventario_articulo,
      });
    }

    // Filtro por jerarquía
    if (filters?.id_rl_infraestructura_jerarquia) {
      conditions.push({
        id_rl_infraestructura_jerarquia:
          filters.id_rl_infraestructura_jerarquia,
      });
    }

    // Filtro por folio (búsqueda parcial)
    if (filters?.folio) {
      conditions.push({
        folio: {
          contains: filters.folio,
        },
      });
    }

    // Filtro por folio antiguo (búsqueda parcial)
    if (filters?.folio_antiguo) {
      conditions.push({
        folio_antiguo: {
          contains: filters.folio_antiguo,
        },
      });
    }

    // Filtro por número de serie
    if (filters?.no_serie) {
      conditions.push({
        no_serie: filters.no_serie,
      });
    }

    // Filtro por CCT (búsqueda parcial)
    if (filters?.cct) {
      conditions.push({
        cct: {
          contains: filters.cct,
        },
      });
    }

    if (filters?.id_ct_inventario_material) {
      conditions.push({
        id_ct_inventario_material: filters.id_ct_inventario_material,
      });
    }

    if (filters?.id_ct_inventario_marca) {
      conditions.push({
        id_ct_inventario_marca: filters.id_ct_inventario_marca,
      });
    }

    if (filters?.id_ct_inventario_color) {
      conditions.push({
        id_ct_inventario_color: filters.id_ct_inventario_color,
      });
    }

    if (filters?.id_ct_inventario_proveedor) {
      conditions.push({
        id_ct_inventario_proveedor: filters.id_ct_inventario_proveedor,
      });
    }

    if (filters?.id_ct_inventario_estado_fisico) {
      conditions.push({
        id_ct_inventario_estado_fisico: filters.id_ct_inventario_estado_fisico,
      });
    }

    if (filters?.id_ct_inventario_tipo_articulo) {
      conditions.push({
        id_ct_inventario_tipo_articulo: filters.id_ct_inventario_tipo_articulo,
      });
    }

    // Si hay condiciones, usar AND, sino where vacío
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK
  protected getPrimaryKeyField(): string {
    return "id_dt_inventario_articulo";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "dt_inventario_articulo"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

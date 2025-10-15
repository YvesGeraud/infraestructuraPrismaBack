/**
 * @fileoverview Servicio de ct_inventario_clase usando BaseService
 * Catálogo de clases de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_clase } from "@prisma/client";
import {
  CrearCtInventarioClaseInput,
  ActualizarCtInventarioClaseInput,
  BuscarCtInventarioClaseInput,
} from "../../schemas/inventario/ct_inventario_clase.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_CLASE CON BASE SERVICE =====

export class CtInventarioClaseBaseService extends BaseService<
  ct_inventario_clase,
  CrearCtInventarioClaseInput,
  ActualizarCtInventarioClaseInput,
  BuscarCtInventarioClaseInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_clase",
    defaultOrderBy: { id_ct_inventario_clase: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioClaseInput) {
    const includes: any = {};

    // Include condicional de subclases
    if (filters?.incluir_subclases) {
      includes.ct_inventario_subclase = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para clases de inventario
  protected construirWhereClause(filters?: BuscarCtInventarioClaseInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_clase) {
      conditions.push({
        id_ct_inventario_clase: filters.id_ct_inventario_clase,
      });
    }

    // Filtro por nombre (búsqueda parcial)
    if (filters?.nombre) {
      conditions.push({
        nombre: {
          contains: filters.nombre,
        },
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
    return "id_ct_inventario_clase";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

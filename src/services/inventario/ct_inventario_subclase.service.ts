/**
 * @fileoverview Servicio de ct_inventario_subclase usando BaseService
 * Catálogo de subclases de inventario con relación a clase padre
 */

import { BaseService } from "../BaseService";
import { ct_inventario_subclase } from "@prisma/client";
import {
  CrearCtInventarioSubclaseInput,
  ActualizarCtInventarioSubclaseInput,
  BuscarCtInventarioSubclaseInput,
} from "../../schemas/inventario/ct_inventario_subclase.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_SUBCLASE CON BASE SERVICE =====

export class CtInventarioSubclaseBaseService extends BaseService<
  ct_inventario_subclase,
  CrearCtInventarioSubclaseInput,
  ActualizarCtInventarioSubclaseInput,
  BuscarCtInventarioSubclaseInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_subclase",
    defaultOrderBy: { id_ct_inventario_subclase: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioSubclaseInput) {
    const includes: any = {};

    // Include condicional de clase padre
    if (filters?.incluir_clase) {
      includes.ct_inventario_clase = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para subclases
  protected construirWhereClause(filters?: BuscarCtInventarioSubclaseInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_subclase) {
      conditions.push({
        id_ct_inventario_subclase: filters.id_ct_inventario_subclase,
      });
    }

    // Filtro por clase padre
    if (filters?.id_ct_inventario_clase) {
      conditions.push({
        id_ct_inventario_clase: filters.id_ct_inventario_clase,
      });
    }

    // Filtro por número de subclase
    if (filters?.no_subclase) {
      conditions.push({
        no_subclase: filters.no_subclase,
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
    return "id_ct_inventario_subclase";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_inventario_subclase"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

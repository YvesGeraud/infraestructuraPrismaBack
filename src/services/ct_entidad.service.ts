/**
 * @fileoverview Servicio de ct_entidad usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "./BaseService";
import { ct_entidad } from "@prisma/client";
import {
  CrearCtEntidadInput,
  ActualizarCtEntidadInput,
  BuscarCtEntidadInput,
} from "../schemas/ct_entidad.schema";

//TODO ===== SERVICIO PARA CT_MARCA CON BASE SERVICE =====

export class CtEntidadBaseService extends BaseService<
  ct_entidad,
  CrearCtEntidadInput,
  ActualizarCtEntidadInput,
  BuscarCtEntidadInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_entidad",
    defaultOrderBy: { id_ct_entidad: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Sin includes - tabla simple (3 líneas)
  protected configurarIncludes(filters?: BuscarCtEntidadInput) {
    return {};
  }

  // 🔍 Filtros específicos para entidades
  protected construirWhereClause(filters?: BuscarCtEntidadInput) {
    const where: any = {};

    // Filtro de entidad
    if (filters?.id_ct_entidad) {
      where.id_ct_entidad = filters.id_ct_entidad;
    }

    // Filtro de nombre
    if (filters?.nombre) {
      where.nombre = {
        contains: filters.nombre,
      };
    }

    // Filtro de abreviatura
    if (filters?.abreviatura) {
      where.abreviatura = {
        contains: filters.abreviatura,
      };
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK (3 líneas)
  protected getPrimaryKeyField(): string {
    return "id_ct_entidad";
  }

  // ✨ ¡YA TIENES CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

// 🎉 TOTAL: ¡Solo 18 líneas para CRUD completo!
// Sin BaseService serían ~150 líneas 😱

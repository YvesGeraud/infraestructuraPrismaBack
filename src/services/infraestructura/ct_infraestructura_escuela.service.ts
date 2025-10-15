/**
 * @fileoverview Servicio de ct_infraestructura_escuela usando BaseService
 * Catálogo de escuelas de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_escuela } from "@prisma/client";
import {
  CrearCtInfraestructuraEscuelaInput,
  ActualizarCtInfraestructuraEscuelaInput,
  BuscarCtInfraestructuraEscuelaInput,
} from "../../schemas/infraestructura/ct_infraestructura_escuela.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_ESCUELA CON BASE SERVICE =====

export class CtInfraestructuraEscuelaBaseService extends BaseService<
  ct_infraestructura_escuela,
  CrearCtInfraestructuraEscuelaInput,
  ActualizarCtInfraestructuraEscuelaInput,
  BuscarCtInfraestructuraEscuelaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_escuela",
    defaultOrderBy: { id_ct_infraestructura_escuela: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraEscuelaInput) {
    const includes: any = {};

    // Include individual de ubicación
    if (filters?.incluir_ubicacion) {
      includes.dt_infraestructura_ubicacion = true;
    }

    // Include individual de sostenimiento
    if (filters?.incluir_sostenimiento) {
      includes.ct_infraestructura_sostenimiento = true;
    }

    // Include individual de tipo de escuela
    if (filters?.incluir_tipo_escuela) {
      includes.ct_infraestructura_tipo_escuela = true;
    }

    // Include de todas las relaciones
    if (filters?.incluir_todas_relaciones) {
      includes.dt_infraestructura_ubicacion = true;
      includes.ct_infraestructura_sostenimiento = true;
      includes.ct_infraestructura_tipo_escuela = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para escuelas
  protected construirWhereClause(filters?: BuscarCtInfraestructuraEscuelaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_escuela) {
      conditions.push({
        id_ct_infraestructura_escuela: filters.id_ct_infraestructura_escuela,
      });
    }

    // Filtro por escuela plantel
    if (filters?.id_escuela_plantel) {
      conditions.push({
        id_escuela_plantel: filters.id_escuela_plantel,
      });
    }

    // Filtro por tipo de escuela
    if (filters?.id_ct_tipo_escuela) {
      conditions.push({
        id_ct_tipo_escuela: filters.id_ct_tipo_escuela,
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

    // Filtro por nombre (búsqueda parcial)
    if (filters?.nombre) {
      conditions.push({
        nombre: {
          contains: filters.nombre,
        },
      });
    }

    // Filtro por sostenimiento
    if (filters?.id_ct_sostenimiento) {
      conditions.push({
        id_ct_sostenimiento: filters.id_ct_sostenimiento,
      });
    }

    // Filtro por ubicación
    if (filters?.id_dt_infraestructura_ubicacion) {
      conditions.push({
        id_dt_infraestructura_ubicacion: filters.id_dt_infraestructura_ubicacion,
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
    return "id_ct_infraestructura_escuela";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

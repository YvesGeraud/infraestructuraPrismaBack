/**
 * @fileoverview Servicio de ct_infraestructura_area usando BaseService
 * Catálogo de áreas de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_area } from "@prisma/client";
import {
  CrearCtInfraestructuraAreaInput,
  ActualizarCtInfraestructuraAreaInput,
  BuscarCtInfraestructuraAreaInput,
} from "../../schemas/infraestructura/ct_infraestructura_area.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_AREA CON BASE SERVICE =====

export class CtInfraestructuraAreaBaseService extends BaseService<
  ct_infraestructura_area,
  CrearCtInfraestructuraAreaInput,
  ActualizarCtInfraestructuraAreaInput,
  BuscarCtInfraestructuraAreaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_area",
    defaultOrderBy: { id_ct_infraestructura_area: "asc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraAreaInput) {
    const includes: any = {};

    // Include de ubicación
    if (filters?.incluir_ubicacion) {
      includes.dt_infraestructura_ubicacion = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para áreas
  protected construirWhereClause(filters?: BuscarCtInfraestructuraAreaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_area) {
      conditions.push({
        id_ct_infraestructura_area: filters.id_ct_infraestructura_area,
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

    // Filtro por CCT (búsqueda parcial)
    if (filters?.cct) {
      conditions.push({
        cct: {
          contains: filters.cct,
        },
      });
    }

    // Filtro por ubicación
    if (filters?.id_dt_infraestructura_ubicacion) {
      conditions.push({
        id_dt_infraestructura_ubicacion:
          filters.id_dt_infraestructura_ubicacion,
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
    return "id_ct_infraestructura_area";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_infraestructura_area"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

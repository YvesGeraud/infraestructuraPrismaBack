/**
 * @fileoverview Servicio de ct_infraestructura_supervisor usando BaseService
 * Catálogo de supervisores de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_supervisor } from "@prisma/client";
import {
  CrearCtInfraestructuraSupervisorInput,
  ActualizarCtInfraestructuraSupervisorInput,
  BuscarCtInfraestructuraSupervisorInput,
} from "../../schemas/infraestructura/ct_infraestructura_supervisor.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_SUPERVISOR CON BASE SERVICE =====

export class CtInfraestructuraSupervisorBaseService extends BaseService<
  ct_infraestructura_supervisor,
  CrearCtInfraestructuraSupervisorInput,
  ActualizarCtInfraestructuraSupervisorInput,
  BuscarCtInfraestructuraSupervisorInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_supervisor",
    defaultOrderBy: { id_ct_infraestructura_supervisor: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraSupervisorInput) {
    const includes: any = {};

    // Include de ubicación
    if (filters?.incluir_ubicacion) {
      includes.dt_infraestructura_ubicacion = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para supervisores
  protected construirWhereClause(filters?: BuscarCtInfraestructuraSupervisorInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_supervisor) {
      conditions.push({
        id_ct_infraestructura_supervisor: filters.id_ct_infraestructura_supervisor,
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
    return "id_ct_infraestructura_supervisor";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_infraestructura_supervisor"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

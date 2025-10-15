/**
 * @fileoverview Servicio de ct_infraestructura_sostenimiento usando BaseService
 * Catálogo de sostenimientos de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_sostenimiento } from "@prisma/client";
import {
  CrearCtInfraestructuraSostenimientoInput,
  ActualizarCtInfraestructuraSostenimientoInput,
  BuscarCtInfraestructuraSostenimientoInput,
} from "../../schemas/infraestructura/ct_infraestructura_sostenimiento.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_SOSTENIMIENTO CON BASE SERVICE =====

export class CtInfraestructuraSostenimientoBaseService extends BaseService<
  ct_infraestructura_sostenimiento,
  CrearCtInfraestructuraSostenimientoInput,
  ActualizarCtInfraestructuraSostenimientoInput,
  BuscarCtInfraestructuraSostenimientoInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_sostenimiento",
    defaultOrderBy: { id_ct_infraestructura_sostenimiento: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraSostenimientoInput) {
    const includes: any = {};

    // Include de escuelas
    if (filters?.incluir_escuelas) {
      includes.ct_infraestructura_escuela = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para sostenimientos
  protected construirWhereClause(filters?: BuscarCtInfraestructuraSostenimientoInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_sostenimiento) {
      conditions.push({
        id_ct_infraestructura_sostenimiento: filters.id_ct_infraestructura_sostenimiento,
      });
    }

    // Filtro por sostenimiento (búsqueda parcial)
    if (filters?.sostenimiento) {
      conditions.push({
        sostenimiento: {
          contains: filters.sostenimiento,
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
    return "id_ct_infraestructura_sostenimiento";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

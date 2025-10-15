/**
 * @fileoverview Servicio de ct_infraestructura_departamento usando BaseService
 * Catálogo de departamentos de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_departamento } from "@prisma/client";
import {
  CrearCtInfraestructuraDepartamentoInput,
  ActualizarCtInfraestructuraDepartamentoInput,
  BuscarCtInfraestructuraDepartamentoInput,
} from "../../schemas/infraestructura/ct_infraestructura_departamento.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_DEPARTAMENTO CON BASE SERVICE =====

export class CtInfraestructuraDepartamentoBaseService extends BaseService<
  ct_infraestructura_departamento,
  CrearCtInfraestructuraDepartamentoInput,
  ActualizarCtInfraestructuraDepartamentoInput,
  BuscarCtInfraestructuraDepartamentoInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_departamento",
    defaultOrderBy: { id_ct_infraestructura_departamento: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraDepartamentoInput) {
    const includes: any = {};

    // Include de ubicación
    if (filters?.incluir_ubicacion) {
      includes.dt_infraestructura_ubicacion = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para departamentos
  protected construirWhereClause(filters?: BuscarCtInfraestructuraDepartamentoInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_departamento) {
      conditions.push({
        id_ct_infraestructura_departamento: filters.id_ct_infraestructura_departamento,
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
    return "id_ct_infraestructura_departamento";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

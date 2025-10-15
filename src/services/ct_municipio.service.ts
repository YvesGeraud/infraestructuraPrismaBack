/**
 * @fileoverview Servicio de ct_localidad usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "./BaseService";
  import { ct_municipio } from "@prisma/client";
import {
  CrearCtMunicipioInput,
  ActualizarCtMunicipioInput,
  BuscarCtMunicipioInput,
} from "../schemas/ct_municipio.schema";

//TODO ===== SERVICIO PARA CT_MUNICIPIO CON BASE SERVICE =====

export class CtMunicipioBaseService extends BaseService<
  ct_municipio,
  CrearCtMunicipioInput,
  ActualizarCtMunicipioInput,
  BuscarCtMunicipioInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_municipio",
    defaultOrderBy: { id_ct_municipio: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtMunicipioInput) {
    // Por defecto, sin includes para mejor performance
    const includes: any = {};

    // Solo incluir entidad si se solicita explícitamente
    if (filters?.incluir_ct_entidad) {
      includes.ct_entidad = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined para que Prisma no incluya nada
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para municipios
  protected construirWhereClause(filters?: BuscarCtMunicipioInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro de municipio
    if (filters?.id_ct_municipio) {
      conditions.push({
        id_ct_municipio: filters.id_ct_municipio,
      });
    }

    // Filtro de municipio (simplificado para compatibilidad)
    if (filters?.nombre) {
      conditions.push({
        nombre: {
          contains: filters.nombre,
        },
      });
    }

    // Filtro de municipio
    if (filters?.cve_mun) {
      conditions.push({
        cve_mun: filters.cve_mun,
      });
    }

    // Filtro de ámbito
    if (filters?.id_ct_entidad) {
      conditions.push({
        id_ct_entidad: filters.id_ct_entidad,
      });
    }

    // Si hay condiciones, usar AND, sino where vacío
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  
  // 🔧 Sobrescribir campo PK (3 líneas)
  protected getPrimaryKeyField(): string {
    return "id_ct_municipio";
  }

 // ✨ ¡YA TIENES CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_municipio"; // Nombre exacto de la tabla
}

// 🎉 TOTAL: ¡Solo 18 líneas para CRUD completo!
// Sin BaseService serían ~150 líneas 😱

// 📝 CON BITÁCORA: ¡Solo +2 líneas más! (CRUD + auditoría automática)
// Sin BaseService con bitácora serían ~350+ líneas 🚀

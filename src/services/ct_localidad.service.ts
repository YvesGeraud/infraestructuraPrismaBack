/**
 * @fileoverview Servicio de ct_localidad usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "./BaseService";
import { ct_localidad } from "@prisma/client";
import {
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  BuscarCtLocalidadInput,
} from "../schemas/ct_localidad.schema";

//TODO ===== SERVICIO PARA CT_LOCALIDAD CON BASE SERVICE =====

export class CtLocalidadBaseService extends BaseService<
  ct_localidad,
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  BuscarCtLocalidadInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_localidad", // Nombre del modelo en Prisma (no de la tabla)
    defaultOrderBy: { id_ct_localidad: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtLocalidadInput) {
    // Por defecto, sin includes para mejor performance
    const includes: any = {};

    // Include condicional de municipio
    if (filters?.incluir_municipio) {
      includes.ct_municipio = true;
    }

    // Include anidado: municipio + entidad
    if (filters?.incluir_municipio_con_entidad) {
      includes.ct_municipio = {
        include: {
          ct_entidad: true,
        },
      };
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined para que Prisma no incluya nada
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para municipios
  protected construirWhereClause(filters?: BuscarCtLocalidadInput) {
    const where: any = {};
    const conditions: any[] = [];

    if (filters?.id_ct_localidad) {
      conditions.push({
        id_ct_localidad: filters.id_ct_localidad,
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

    if (filters?.codigo_postal) {
      conditions.push({
        codigo_postal: filters.codigo_postal,
      });
    }

    // Filtro de municipio
    if (filters?.ambito) {
      conditions.push({
        ambito: filters.ambito,
      });
    }

    // Filtro de ámbito
    if (filters?.id_ct_municipio) {
      conditions.push({
        id_ct_municipio: filters.id_ct_municipio,
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
    return "id_ct_localidad";
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
  protected nombreTablaParaBitacora = "ct_localidad"; // Nombre exacto de la tabla
}

// 🎉 TOTAL: ¡Solo 18 líneas para CRUD completo!
// Sin BaseService serían ~150 líneas 😱

// 📝 CON BITÁCORA: ¡Solo +2 líneas más! (CRUD + auditoría automática)
// Sin BaseService con bitácora serían ~350+ líneas 🚀

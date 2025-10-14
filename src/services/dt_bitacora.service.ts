/**
 * @fileoverview Servicio de dt_bitacora usando BaseService
 * Registra todos los cambios realizados en las tablas auditadas del sistema
 */

import { BaseService } from "./BaseService";
import { dt_bitacora } from "@prisma/client";
import {
  CrearDtBitacoraInput,
  ActualizarDtBitacoraInput,
  BuscarDtBitacoraInput,
} from "../schemas/dt_bitacora.schema";

//TODO ===== SERVICIO PARA DT_BITACORA CON BASE SERVICE =====

export class DtBitacoraBaseService extends BaseService<
  dt_bitacora,
  CrearDtBitacoraInput,
  ActualizarDtBitacoraInput,
  BuscarDtBitacoraInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "dt_bitacora",
    defaultOrderBy: { id_dt_bitacora: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarDtBitacoraInput) {
    const includes: any = {};

    // Include individual de acción
    if (filters?.incluir_accion) {
      includes.ct_bitacora_accion = true;
    }

    // Include individual de tabla
    if (filters?.incluir_tabla) {
      includes.ct_bitacora_tabla = true;
    }

    // Include individual de sesión
    if (filters?.incluir_sesion) {
      includes.ct_sesion = true;
    }

    // Include de todas las relaciones
    if (filters?.incluir_todas_relaciones) {
      includes.ct_bitacora_accion = true;
      includes.ct_bitacora_tabla = true;
      includes.ct_sesion = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para registros de bitácora
  protected construirWhereClause(filters?: BuscarDtBitacoraInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_dt_bitacora) {
      conditions.push({
        id_dt_bitacora: filters.id_dt_bitacora,
      });
    }

    // Filtro por acción
    if (filters?.id_ct_bitacora_accion) {
      conditions.push({
        id_ct_bitacora_accion: filters.id_ct_bitacora_accion,
      });
    }

    // Filtro por tabla
    if (filters?.id_ct_bitacora_tabla) {
      conditions.push({
        id_ct_bitacora_tabla: filters.id_ct_bitacora_tabla,
      });
    }

    // Filtro por registro afectado
    if (filters?.id_registro_afectado) {
      conditions.push({
        id_registro_afectado: filters.id_registro_afectado,
      });
    }

    // Filtro por sesión
    if (filters?.id_ct_sesion) {
      conditions.push({
        id_ct_sesion: filters.id_ct_sesion,
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
    return "id_dt_bitacora";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
  
  // 📝 Los filtros ya permiten buscar por:
  // - id_ct_bitacora_accion
  // - id_ct_bitacora_tabla
  // - id_registro_afectado
  // - id_ct_sesion
  // Con includes opcionales de accion, tabla y sesion
}


/**
 * @fileoverview Servicio de ct_bitacora_accion usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "../BaseService";
import { ct_bitacora_accion } from "@prisma/client";
import {
  CrearCtBitacoraAccionInput,
  ActualizarCtBitacoraAccionInput,
  BuscarCtBitacoraAccionInput,
} from "../../schemas/bitacora/ct_bitacora_accion.schema";

//TODO ===== SERVICIO PARA CT_MARCA CON BASE SERVICE =====

export class CtBitacoraAccionBaseService extends BaseService<
  ct_bitacora_accion,
  CrearCtBitacoraAccionInput,
  ActualizarCtBitacoraAccionInput,
  BuscarCtBitacoraAccionInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_bitacora_accion",
    defaultOrderBy: { id_ct_bitacora_accion: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Sin includes - tabla simple (3 líneas)
  protected configurarIncludes(filters?: BuscarCtBitacoraAccionInput) {
    return {};
  }

  // 🔍 Filtros específicos para acciones
  protected construirWhereClause(filters?: BuscarCtBitacoraAccionInput) {
    const where: any = {};

    // Filtro de accion
    if (filters?.id_ct_bitacora_accion) {
      where.id_ct_bitacora_accion = filters.id_ct_bitacora_accion;
    }

    // Filtro de nombre
    if (filters?.nombre) {
      where.nombre = {
        contains: filters.nombre,
      };
    }

    // Filtro de descripcion
    if (filters?.descripcion) {
      where.descripcion = {
        contains: filters.descripcion,
      };
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK (3 líneas)
  protected getPrimaryKeyField(): string {
    return "id_ct_bitacora_accion";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_bitacora_accion"; // Nombre exacto de la tabla

  // ✨ ¡YA TIENES CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

// 🎉 TOTAL: ¡Solo 18 líneas para CRUD completo!
// Sin BaseService serían ~150 líneas 😱

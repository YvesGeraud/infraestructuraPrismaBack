/**
 * @fileoverview Servicio de ct_bitacora_tabla usando BaseService
 * Catálogo de tablas que pueden ser auditadas en el sistema
 */

import { BaseService } from "../BaseService";
import { ct_bitacora_tabla } from "@prisma/client";
import {
  CrearCtBitacoraTablaInput,
  ActualizarCtBitacoraTablaInput,
  BuscarCtBitacoraTablaInput,
} from "../../schemas/bitacora/ct_bitacora_tabla.schema";

//TODO ===== SERVICIO PARA CT_BITACORA_TABLA CON BASE SERVICE =====

export class CtBitacoraTablaBaseService extends BaseService<
  ct_bitacora_tabla,
  CrearCtBitacoraTablaInput,
  ActualizarCtBitacoraTablaInput,
  BuscarCtBitacoraTablaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_bitacora_tabla",
    defaultOrderBy: { id_ct_bitacora_tabla: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtBitacoraTablaInput) {
    // Para ct_bitacora_tabla no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para tablas de bitácora
  protected construirWhereClause(filters?: BuscarCtBitacoraTablaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_bitacora_tabla) {
      conditions.push({
        id_ct_bitacora_tabla: filters.id_ct_bitacora_tabla,
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

    // Filtro por descripción (búsqueda parcial)
    if (filters?.descripcion) {
      conditions.push({
        descripcion: {
          contains: filters.descripcion,
        },
      });
    }

    // Filtro por bandera de auditoría
    if (filters?.auditar !== undefined) {
      conditions.push({
        auditar: filters.auditar,
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
    return "id_ct_bitacora_tabla";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_bitacora_tabla"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

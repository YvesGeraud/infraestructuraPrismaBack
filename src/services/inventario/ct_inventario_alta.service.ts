/**
 * @fileoverview Servicio de ct_inventario_alta usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "../BaseService";
import { ct_inventario_alta } from "@prisma/client";
import {
  CrearCtInventarioAltaInput,
  ActualizarCtInventarioAltaInput,
  BuscarCtInventarioAltaInput,
} from "../../schemas/inventario/ct_inventario_alta.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_ALTA CON BASE SERVICE =====

export class CtInventarioAltaBaseService extends BaseService<
  ct_inventario_alta,
  CrearCtInventarioAltaInput,
  ActualizarCtInventarioAltaInput,
  BuscarCtInventarioAltaInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_inventario_alta",
    defaultOrderBy: { id_ct_inventario_alta: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Sin includes - tabla simple (3 líneas)
  protected configurarIncludes(filters?: BuscarCtInventarioAltaInput) {
    return {};
  }

  // 🔍 Filtros específicos para inventario alta
  protected construirWhereClause(filters?: BuscarCtInventarioAltaInput) {
    const where: any = {};

    // Filtro de inventario alta
    if (filters?.id_ct_inventario_alta) {
      where.id_ct_inventario_alta = filters.id_ct_inventario_alta;
    }

    // Filtro de nombre
    if (filters?.nombre) {
      where.nombre = {
        contains: filters.nombre,
      };
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK (3 líneas)
  protected getPrimaryKeyField(): string {
    return "id_ct_inventario_alta";
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
  protected nombreTablaParaBitacora = "ct_inventario_alta"; // Nombre exacto de la tabla
}

// 🎉 TOTAL: ¡Solo 18 líneas para CRUD completo!
// Sin BaseService serían ~150 líneas 😱

// 📝 CON BITÁCORA: ¡Solo +2 líneas más! (CRUD + auditoría automática)
// Sin BaseService con bitácora serían ~350+ líneas 🚀

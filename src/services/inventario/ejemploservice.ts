/**
 * @fileoverview Servicio de ct_marca usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "../BaseService";
import { Ct_inventario_marca } from "@prisma/client";
import {
  CrearCtMarcaInput,
  ActualizarCtMarcaInput,
} from "../../schemas/inventario/ct_marca.schema";

//TODO ===== SERVICIO PARA CT_MARCA CON BASE SERVICE =====

export class CtMarcaBaseService extends BaseService<
  Ct_inventario_marca,
  CrearCtMarcaInput,
  ActualizarCtMarcaInput,
  any
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_inventario_marca",
    defaultOrderBy: { descripcion: "asc" as const },
  };

  // 🔗 Sin includes - tabla simple (3 líneas)
  protected configurarIncludes() {
    return {};
  }

  // 🔍 Filtros específicos para marcas (8 líneas)
  protected construirWhereClause(filters?: any) {
    const where: any = {};

    if (filters?.descripcion) {
      where.descripcion = { contains: filters.descripcion };
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK (3 líneas)
  protected getPrimaryKeyField(): string {
    return "id_marca";
  }

  // ✨ ¡YA TIENES CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

// 🎉 TOTAL: ¡Solo 18 líneas para CRUD completo!
// Sin BaseService serían ~150 líneas 😱

/**
 * @fileoverview Servicio de ct_inventario_tipo_articulo usando BaseService
 * Catálogo de tipos de artículo para inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_tipo_articulo } from "@prisma/client";
import {
  CrearCtInventarioTipoArticuloInput,
  ActualizarCtInventarioTipoArticuloInput,
  BuscarCtInventarioTipoArticuloInput,
} from "../../schemas/inventario/ct_inventario_tipo_articulo.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_TIPO_ARTICULO CON BASE SERVICE =====

export class CtInventarioTipoArticuloBaseService extends BaseService<
  ct_inventario_tipo_articulo,
  CrearCtInventarioTipoArticuloInput,
  ActualizarCtInventarioTipoArticuloInput,
  BuscarCtInventarioTipoArticuloInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_tipo_articulo",
    defaultOrderBy: { id_ct_inventario_tipo_articulo: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioTipoArticuloInput) {
    // Para ct_inventario_tipo_articulo no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para tipos de artículo
  protected construirWhereClause(filters?: BuscarCtInventarioTipoArticuloInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_tipo_articulo) {
      conditions.push({
        id_ct_inventario_tipo_articulo: filters.id_ct_inventario_tipo_articulo,
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

    // Si hay condiciones, usar AND, sino where vacío
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK
  protected getPrimaryKeyField(): string {
    return "id_ct_inventario_tipo_articulo";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

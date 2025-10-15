/**
 * @fileoverview Servicio de ct_inventario_color usando BaseService
 * Catálogo de colores para artículos de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_color } from "@prisma/client";
import {
  CrearCtInventarioColorInput,
  ActualizarCtInventarioColorInput,
  BuscarCtInventarioColorInput,
} from "../../schemas/inventario/ct_inventario_color.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_COLOR CON BASE SERVICE =====

export class CtInventarioColorBaseService extends BaseService<
  ct_inventario_color,
  CrearCtInventarioColorInput,
  ActualizarCtInventarioColorInput,
  BuscarCtInventarioColorInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_color",
    defaultOrderBy: { id_ct_inventario_color: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioColorInput) {
    // Para ct_inventario_color no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para colores de inventario
  protected construirWhereClause(filters?: BuscarCtInventarioColorInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_color) {
      conditions.push({
        id_ct_inventario_color: filters.id_ct_inventario_color,
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
    return "id_ct_inventario_color";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

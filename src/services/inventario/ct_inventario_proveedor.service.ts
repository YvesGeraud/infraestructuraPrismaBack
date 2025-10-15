/**
 * @fileoverview Servicio de ct_inventario_proveedor usando BaseService
 * Catálogo de proveedores para artículos de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_proveedor } from "@prisma/client";
import {
  CrearCtInventarioProveedorInput,
  ActualizarCtInventarioProveedorInput,
  BuscarCtInventarioProveedorInput,
} from "../../schemas/inventario/ct_inventario_proveedor.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_PROVEEDOR CON BASE SERVICE =====

export class CtInventarioProveedorBaseService extends BaseService<
  ct_inventario_proveedor,
  CrearCtInventarioProveedorInput,
  ActualizarCtInventarioProveedorInput,
  BuscarCtInventarioProveedorInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_proveedor",
    defaultOrderBy: { id_ct_inventario_proveedor: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioProveedorInput) {
    // Para ct_inventario_proveedor no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para proveedores
  protected construirWhereClause(filters?: BuscarCtInventarioProveedorInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_proveedor) {
      conditions.push({
        id_ct_inventario_proveedor: filters.id_ct_inventario_proveedor,
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
    return "id_ct_inventario_proveedor";
  }

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

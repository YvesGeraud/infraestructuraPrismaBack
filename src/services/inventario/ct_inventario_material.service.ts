/**
 * @fileoverview Servicio de ct_inventario_material usando BaseService
 * Catálogo de materiales para artículos de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_material } from "@prisma/client";
import {
  CrearCtInventarioMaterialInput,
  ActualizarCtInventarioMaterialInput,
  BuscarCtInventarioMaterialInput,
} from "../../schemas/inventario/ct_inventario_material.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_MATERIAL CON BASE SERVICE =====

export class CtInventarioMaterialBaseService extends BaseService<
  ct_inventario_material,
  CrearCtInventarioMaterialInput,
  ActualizarCtInventarioMaterialInput,
  BuscarCtInventarioMaterialInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_material",
    defaultOrderBy: { id_ct_inventario_material: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioMaterialInput) {
    // Para ct_inventario_material no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para materiales
  protected construirWhereClause(filters?: BuscarCtInventarioMaterialInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_material) {
      conditions.push({
        id_ct_inventario_material: filters.id_ct_inventario_material,
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
    return "id_ct_inventario_material";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_inventario_material"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

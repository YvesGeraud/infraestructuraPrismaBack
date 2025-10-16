/**
 * @fileoverview Servicio de ct_inventario_baja usando BaseService
 * Catálogo de causas de baja para artículos de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_baja } from "@prisma/client";
import {
  CrearCtInventarioBajaInput,
  ActualizarCtInventarioBajaInput,
  BuscarCtInventarioBajaInput,
} from "../../schemas/inventario/ct_inventario_baja.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_BAJA CON BASE SERVICE =====

export class CtInventarioBajaBaseService extends BaseService<
  ct_inventario_baja,
  CrearCtInventarioBajaInput,
  ActualizarCtInventarioBajaInput,
  BuscarCtInventarioBajaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_baja",
    defaultOrderBy: { id_ct_inventario_baja: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioBajaInput) {
    // Para ct_inventario_baja no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para causas de baja
  protected construirWhereClause(filters?: BuscarCtInventarioBajaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_baja) {
      conditions.push({
        id_ct_inventario_baja: filters.id_ct_inventario_baja,
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
    return "id_ct_inventario_baja";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_inventario_baja"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

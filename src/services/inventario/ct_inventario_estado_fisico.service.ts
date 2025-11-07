/**
 * @fileoverview Servicio de ct_inventario_estado_fisico usando BaseService
 * Catálogo de estados físicos para artículos de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_estado_fisico } from "@prisma/client";
import {
  CrearCtInventarioEstadoFisicoInput,
  ActualizarCtInventarioEstadoFisicoInput,
  BuscarCtInventarioEstadoFisicoInput,
} from "../../schemas/inventario/ct_inventario_estado_fisico.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_ESTADO_FISICO CON BASE SERVICE =====

export class CtInventarioEstadoFisicoBaseService extends BaseService<
  ct_inventario_estado_fisico,
  CrearCtInventarioEstadoFisicoInput,
  ActualizarCtInventarioEstadoFisicoInput,
  BuscarCtInventarioEstadoFisicoInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_estado_fisico",
    defaultOrderBy: { id_ct_inventario_estado_fisico: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioEstadoFisicoInput) {
    // Para ct_inventario_estado_fisico no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para estados físicos
  protected construirWhereClause(filters?: BuscarCtInventarioEstadoFisicoInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_estado_fisico) {
      conditions.push({
        id_ct_inventario_estado_fisico: filters.id_ct_inventario_estado_fisico,
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
    return "id_ct_inventario_estado_fisico";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_inventario_estado_fisico"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

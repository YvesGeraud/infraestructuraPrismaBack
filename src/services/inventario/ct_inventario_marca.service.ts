/**
 * @fileoverview Servicio de ct_inventario_marca usando BaseService
 * Catálogo de marcas para artículos de inventario
 */

import { BaseService } from "../BaseService";
import { ct_inventario_marca } from "@prisma/client";
import {
  CrearCtInventarioMarcaInput,
  ActualizarCtInventarioMarcaInput,
  BuscarCtInventarioMarcaInput,
} from "../../schemas/inventario/ct_inventario_marca.schema";

//TODO ===== SERVICIO PARA CT_INVENTARIO_MARCA CON BASE SERVICE =====

export class CtInventarioMarcaBaseService extends BaseService<
  ct_inventario_marca,
  CrearCtInventarioMarcaInput,
  ActualizarCtInventarioMarcaInput,
  BuscarCtInventarioMarcaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_marca",
    defaultOrderBy: { id_ct_inventario_marca: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInventarioMarcaInput) {
    // Para ct_inventario_marca no hay includes por defecto
    // Esta es una tabla catálogo simple
    return undefined;
  }

  // 🔍 Filtros específicos para marcas
  protected construirWhereClause(filters?: BuscarCtInventarioMarcaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_inventario_marca) {
      conditions.push({
        id_ct_inventario_marca: filters.id_ct_inventario_marca,
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
    return "id_ct_inventario_marca";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_inventario_marca"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

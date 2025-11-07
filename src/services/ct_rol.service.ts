/**
 * @fileoverview Servicio de ct_rol usando BaseService
 * Catálogo de roles de usuario
 */

import { BaseService } from "./BaseService";
import { ct_rol } from "@prisma/client";
import {
  CrearCtRolInput,
  ActualizarCtRolInput,
  BuscarCtRolInput,
} from "../schemas/ct_rol.schema";

//TODO ===== SERVICIO PARA CT_ROL CON BASE SERVICE =====

export class CtRolBaseService extends BaseService<
  ct_rol,
  CrearCtRolInput,
  ActualizarCtRolInput,
  BuscarCtRolInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_rol",
    defaultOrderBy: { id_ct_rol: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtRolInput) {
    // Para ct_rol no hay includes por defecto
    return undefined;
  }

  // 🔍 Filtros específicos para roles
  protected construirWhereClause(filters?: BuscarCtRolInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_rol) {
      conditions.push({
        id_ct_rol: filters.id_ct_rol,
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

    // Si hay condiciones, usar AND, sino where vacío
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK
  protected getPrimaryKeyField(): string {
    return "id_ct_rol";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_rol";

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
}


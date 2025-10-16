/**
 * @fileoverview Servicio de ct_infraestructura_tipo_escuela usando BaseService
 * Catálogo de tipos de escuela de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_tipo_escuela } from "@prisma/client";
import {
  CrearCtInfraestructuraTipoEscuelaInput,
  ActualizarCtInfraestructuraTipoEscuelaInput,
  BuscarCtInfraestructuraTipoEscuelaInput,
} from "../../schemas/infraestructura/ct_infraestructura_tipo_escuela.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_TIPO_ESCUELA CON BASE SERVICE =====

export class CtInfraestructuraTipoEscuelaBaseService extends BaseService<
  ct_infraestructura_tipo_escuela,
  CrearCtInfraestructuraTipoEscuelaInput,
  ActualizarCtInfraestructuraTipoEscuelaInput,
  BuscarCtInfraestructuraTipoEscuelaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_tipo_escuela",
    defaultOrderBy: { id_ct_infraestructura_tipo_escuela: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraTipoEscuelaInput) {
    const includes: any = {};

    // Include de escuelas
    if (filters?.incluir_escuelas) {
      includes.ct_infraestructura_escuela = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para tipos de escuela
  protected construirWhereClause(filters?: BuscarCtInfraestructuraTipoEscuelaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_tipo_escuela) {
      conditions.push({
        id_ct_infraestructura_tipo_escuela: filters.id_ct_infraestructura_tipo_escuela,
      });
    }

    // Filtro por tipo de escuela (búsqueda parcial)
    if (filters?.tipo_escuela) {
      conditions.push({
        tipo_escuela: {
          contains: filters.tipo_escuela,
        },
      });
    }

    // Filtro por clave (búsqueda parcial)
    if (filters?.clave) {
      conditions.push({
        clave: {
          contains: filters.clave,
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
    return "id_ct_infraestructura_tipo_escuela";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_infraestructura_tipo_escuela"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

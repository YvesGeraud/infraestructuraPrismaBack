/**
 * @fileoverview Servicio de ct_infraestructura_tipo_instancia usando BaseService
 * Catálogo de tipos de instancia de infraestructura
 */

import { BaseService } from "../BaseService";
import { ct_infraestructura_tipo_instancia } from "@prisma/client";
import {
  CrearCtInfraestructuraTipoInstanciaInput,
  ActualizarCtInfraestructuraTipoInstanciaInput,
  BuscarCtInfraestructuraTipoInstanciaInput,
} from "../../schemas/infraestructura/ct_infraestructura_tipo_instancia.schema";

//TODO ===== SERVICIO PARA CT_INFRAESTRUCTURA_TIPO_INSTANCIA CON BASE SERVICE =====

export class CtInfraestructuraTipoInstanciaBaseService extends BaseService<
  ct_infraestructura_tipo_instancia,
  CrearCtInfraestructuraTipoInstanciaInput,
  ActualizarCtInfraestructuraTipoInstanciaInput,
  BuscarCtInfraestructuraTipoInstanciaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_infraestructura_tipo_instancia",
    defaultOrderBy: { id_ct_infraestructura_tipo_instancia: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarCtInfraestructuraTipoInstanciaInput) {
    const includes: any = {};

    // Include de jerarquías
    if (filters?.incluir_jerarquias) {
      includes.rl_infraestructura_jerarquia = true;
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para tipos de instancia
  protected construirWhereClause(filters?: BuscarCtInfraestructuraTipoInstanciaInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_ct_infraestructura_tipo_instancia) {
      conditions.push({
        id_ct_infraestructura_tipo_instancia: filters.id_ct_infraestructura_tipo_instancia,
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
    return "id_ct_infraestructura_tipo_instancia";
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "ct_infraestructura_tipo_instancia"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

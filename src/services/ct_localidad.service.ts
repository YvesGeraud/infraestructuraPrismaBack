/**
 * @fileoverview Servicio de ct_localidad usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "./BaseService";
import { Ct_localidad } from "@prisma/client";
import {
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  BuscarLocalidadesInput,
} from "../schemas/ct_localidad.schema";

//TODO ===== SERVICIO PARA CT_LOCALIDAD CON BASE SERVICE =====

export class CtLocalidadBaseService extends BaseService<
  Ct_localidad,
  CrearCtLocalidadInput,
  ActualizarCtLocalidadInput,
  BuscarLocalidadesInput
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_localidad",
    defaultOrderBy: { id_localidad: "asc" as const },
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarLocalidadesInput) {
    // Por defecto, sin includes para mejor performance
    const includes: any = {};

    // Solo incluir municipio si se solicita explícitamente
    if (filters?.incluir_municipio) {
      includes.ct_municipio = true;
    }

    // Incluir municipio + estado si se solicita el detalle completo
    if (filters?.incluir_detalle_completo) {
      includes.ct_municipio = {
        include: {
          ct_estado: true,
        },
      };
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined para que Prisma no incluya nada
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para localidades
  protected construirWhereClause(filters?: BuscarLocalidadesInput) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro de localidad (simplificado para compatibilidad)
    if (filters?.localidad) {
      conditions.push({
        localidad: {
          contains: filters.localidad,
        },
      });
    }

    // Filtro de municipio
    if (filters?.id_municipio) {
      conditions.push({
        id_municipio: filters.id_municipio,
      });
    }

    // Filtro de ámbito
    if (filters?.ambito) {
      conditions.push({
        ambito: filters.ambito,
      });
    }

    // Si hay condiciones, usar AND, sino where vacío
    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // ✅ NO necesitamos sobreescribir getPrimaryKeyField()
  // El algoritmo inteligente detecta: ct_localidad → id_localidad automáticamente
}

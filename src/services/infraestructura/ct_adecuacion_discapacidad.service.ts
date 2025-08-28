/**
 * @fileoverview Servicio de ct_marca usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "../BaseService";
import { Ct_infraestructura_adecuacion_discapacidad } from "@prisma/client";
import {
  CrearCtAdecuacionDiscapacidadInput,
  ActualizarCtAdecuacionDiscapacidadInput,
} from "../../schemas/infraestructura/ct_adecuacion_discapacidad.schema";

//TODO ===== SERVICIO PARA CT_ADECUACION_DISCAPACIDAD CON BASE SERVICE =====

export class CtAdecuacionDiscapacidadBaseService extends BaseService<
  Ct_infraestructura_adecuacion_discapacidad,
  CrearCtAdecuacionDiscapacidadInput,
  ActualizarCtAdecuacionDiscapacidadInput,
  any
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_infraestructura_adecuacion_discapacidad",
    defaultOrderBy: { id_adecuacion: "asc" as const },
  };

  // 🔗 Sin includes - tabla simple (3 líneas)
  protected configurarIncludes() {
    return {};
  }

  // 🔍 Filtros específicos para marcas (8 líneas)
  protected construirWhereClause(filters?: any) {
    const where: any = {};

    if (filters?.descripcion) {
      where.descripcion = { contains: filters.descripcion };
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK (3 líneas)
  protected getPrimaryKeyField(): string {
    return "id_adecuacion";
  }
}

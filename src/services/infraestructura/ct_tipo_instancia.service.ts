/**
 * @fileoverview Servicio de ct_tipo_instancia usando BaseService
 * ¡Prueba de que solo necesitas ~15 líneas para un CRUD completo!
 */

import { BaseService } from "../BaseService";
import { Ct_infraestructura_tipo_instancia } from "@prisma/client";
import {
  CrearCtTipoInstanciaInput,
  ActualizarCtTipoInstanciaInput,
} from "../../schemas/infraestructura/ct_tipo_instancia.schema";

//TODO ===== SERVICIO PARA CT_TIPO_INSTANCIA CON BASE SERVICE =====

export class CtTipoInstanciaBaseService extends BaseService<
  Ct_infraestructura_tipo_instancia,
  CrearCtTipoInstanciaInput,
  ActualizarCtTipoInstanciaInput,
  any
> {
  // 🔧 Configuración específica del modelo (4 líneas)
  protected config = {
    tableName: "ct_infraestructura_tipo_instancia",
    defaultOrderBy: { id_tipo: "asc" as const },
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
    return "id_tipo_instancia";
  }
}

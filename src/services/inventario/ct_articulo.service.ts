/**
 * @fileoverview Servicio de ct_articulo usando BaseService
 */

import { BaseService } from "../BaseService";
import { Ct_inventario_articulo } from "@prisma/client";
import {
  CrearCtArticuloInput,
  ActualizarCtArticuloInput,
  BuscarArticulosInput,
} from "../../schemas/inventario/ct_articulo.schema";

//TODO ===== SERVICIO PARA CT_ARTICULO CON BASE SERVICE =====

export class CtArticuloBaseService extends BaseService<
  Ct_inventario_articulo,
  CrearCtArticuloInput,
  ActualizarCtArticuloInput,
  BuscarArticulosInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "ct_inventario_articulo",
    defaultOrderBy: { id_articulo: "asc" as const },
  };

  // 🔗 Sin includes - tabla simple
  protected configurarIncludes() {
    return {};
  }

  // 🔍 Filtros específicos para artículos
  protected construirWhereClause(filters?: BuscarArticulosInput) {
    const where: any = {};

    if (filters?.folio) {
      where.folio = { contains: filters.folio };
    }

    return where;
  }
}

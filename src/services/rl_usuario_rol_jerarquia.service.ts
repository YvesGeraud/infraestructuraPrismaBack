/**
 * @fileoverview Servicio de rl_usuario_rol_jerarquia usando BaseService
 * Relaciones entre usuarios, roles y jerarquías
 */

import { BaseService } from "./BaseService";
import { rl_usuario_rol_jerarquia } from "@prisma/client";
import {
  CrearRlUsuarioRolJerarquiaInput,
  ActualizarRlUsuarioRolJerarquiaInput,
  BuscarRlUsuarioRolJerarquiaInput,
} from "../schemas/rl_usuario_rol_jerarquia.schema";

//TODO ===== SERVICIO PARA RL_USUARIO_ROL_JERARQUIA CON BASE SERVICE =====

export class RlUsuarioRolJerarquiaBaseService extends BaseService<
  rl_usuario_rol_jerarquia,
  CrearRlUsuarioRolJerarquiaInput,
  ActualizarRlUsuarioRolJerarquiaInput,
  BuscarRlUsuarioRolJerarquiaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "rl_usuario_rol_jerarquia",
    defaultOrderBy: { id_rl_usuario_rol_jerarquia: "asc" as const },
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(filters?: BuscarRlUsuarioRolJerarquiaInput) {
    const includes: any = {};

    if (filters?.incluir_rol) {
      includes.ct_rol = true;
    }

    if (filters?.incluir_usuario) {
      includes.ct_usuario = {
        select: {
          id_ct_usuario: true,
          usuario: true,
          email: true,
          estado: true,
        },
      };
    }

    if (filters?.incluir_jerarquia) {
      includes.rl_infraestructura_jerarquia = {
        include: {
          ct_infraestructura_tipo_instancia: true,
        },
      };
    }

    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos
  protected construirWhereClause(filters?: BuscarRlUsuarioRolJerarquiaInput) {
    const where: any = {};
    const conditions: any[] = [];

    if (filters?.id_rl_usuario_rol_jerarquia) {
      conditions.push({
        id_rl_usuario_rol_jerarquia: filters.id_rl_usuario_rol_jerarquia,
      });
    }

    if (filters?.id_ct_usuario) {
      conditions.push({
        id_ct_usuario: filters.id_ct_usuario,
      });
    }

    if (filters?.id_externo) {
      conditions.push({
        id_externo: filters.id_externo,
      });
    }

    if (filters?.id_ct_rol) {
      conditions.push({
        id_ct_rol: filters.id_ct_rol,
      });
    }

    if (filters?.id_rl_infraestructura_jerarquia !== undefined) {
      if (filters.id_rl_infraestructura_jerarquia === null) {
        conditions.push({
          id_rl_infraestructura_jerarquia: null,
        });
      } else {
        conditions.push({
          id_rl_infraestructura_jerarquia:
            filters.id_rl_infraestructura_jerarquia,
        });
      }
    }

    if (conditions.length > 0) {
      where.AND = conditions;
    }

    return where;
  }

  // 🔧 Sobrescribir campo PK
  protected getPrimaryKeyField(): string {
    return "id_rl_usuario_rol_jerarquia";
  }

  /**
   * 🔍 OBTENER ROL Y JERARQUÍA POR USUARIO
   * Obtiene la relación activa de un usuario con su rol y jerarquía asignada
   */
  async obtenerRolYJerarquiaPorUsuario(idUsuario: number) {
    const { prisma } = await import("../config/database");

    const relacion = await prisma.rl_usuario_rol_jerarquia.findFirst({
      where: {
        id_ct_usuario: idUsuario,
        estado: true,
      },
      include: {
        ct_rol: true,
        rl_infraestructura_jerarquia: {
          include: {
            ct_infraestructura_tipo_instancia: true,
          },
        },
      },
      orderBy: {
        fecha_in: "desc",
      },
    });

    return relacion;
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "rl_usuario_rol_jerarquia";

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
}

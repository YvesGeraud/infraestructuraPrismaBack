/**
 * @fileoverview Servicio de rl_infraestructura_jerarquia usando BaseService
 * Relaciones jerárquicas de infraestructura
 */

import { BaseService } from "../BaseService";
import { rl_infraestructura_jerarquia } from "@prisma/client";
import {
  CrearRlInfraestructuraJerarquiaInput,
  ActualizarRlInfraestructuraJerarquiaInput,
  BuscarRlInfraestructuraJerarquiaInput,
} from "../../schemas/infraestructura/rl_infraestructura_jerarquia.schema";
import logger from "../../config/logger";

//TODO ===== SERVICIO PARA RL_INFRAESTRUCTURA_JERARQUIA CON BASE SERVICE =====

export class RlInfraestructuraJerarquiaBaseService extends BaseService<
  rl_infraestructura_jerarquia,
  CrearRlInfraestructuraJerarquiaInput,
  ActualizarRlInfraestructuraJerarquiaInput,
  BuscarRlInfraestructuraJerarquiaInput
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "rl_infraestructura_jerarquia",
    defaultOrderBy: { id_rl_infraestructura_jerarquia: "desc" as const }, // Más recientes primero
    campoActivo: "estado",
  };

  // 🔗 Includes condicionales basados en filtros
  protected configurarIncludes(
    filters?: BuscarRlInfraestructuraJerarquiaInput
  ) {
    const includes: any = {};

    // Include de tipo de instancia
    if (filters?.incluir_tipo_instancia) {
      includes.ct_infraestructura_tipo_instancia = true;
    }

    // Include de dependencia (self-reference)
    // NOTA: Para incluir la dependencia completa, necesitamos hacer consulta adicional
    // ya que Prisma no tiene relación automática para self-reference
    if (filters?.incluir_dependencia) {
      // Este include no funcionará directamente porque no hay relación definida en Prisma
      // Se manejará en el método obtenerPorId o obtenerTodos con consulta adicional
      // Por ahora, lo dejamos comentado para evitar errores
      // TODO: Implementar consulta adicional para obtener dependencia
    }

    // 🎯 IMPORTANTE: Si no hay includes, retornar undefined
    return Object.keys(includes).length > 0 ? includes : undefined;
  }

  // 🔍 Filtros específicos para jerarquías
  protected construirWhereClause(
    filters?: BuscarRlInfraestructuraJerarquiaInput
  ) {
    const where: any = {};
    const conditions: any[] = [];

    // Filtro por ID
    if (filters?.id_rl_infraestructura_jerarquia) {
      conditions.push({
        id_rl_infraestructura_jerarquia:
          filters.id_rl_infraestructura_jerarquia,
      });
    }

    // Filtro por ID de instancia
    if (filters?.id_instancia) {
      conditions.push({
        id_instancia: filters.id_instancia,
      });
    }

    // Filtro por tipo de instancia
    if (filters?.id_ct_infraestructura_tipo_instancia) {
      conditions.push({
        id_ct_infraestructura_tipo_instancia:
          filters.id_ct_infraestructura_tipo_instancia,
      });
    }

    // Filtro por dependencia
    if (filters?.id_dependencia !== undefined) {
      if (filters.id_dependencia === null) {
        // Buscar jerarquías sin dependencia (nivel superior)
        conditions.push({
          id_dependencia: null,
        });
      } else {
        conditions.push({
          id_dependencia: filters.id_dependencia,
        });
      }
    }

    // Filtro por estado
    if (filters?.estado !== undefined) {
      conditions.push({
        estado: filters.estado,
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
    return "id_rl_infraestructura_jerarquia";
  }

  /**
   * 🔍 OBTENER JERARQUÍA CON DEPENDENCIA
   *
   * Método personalizado para obtener una jerarquía con su dependencia completa
   * ya que Prisma no tiene relación automática para self-reference
   */
  async obtenerConDependencia(
    idJerarquia: number,
    incluirTipoInstancia: boolean = true
  ) {
    const { prisma } = await import("../../config/database");

    // Obtener jerarquía con tipo de instancia si se solicita
    const jerarquia = await prisma.rl_infraestructura_jerarquia.findUnique({
      where: { id_rl_infraestructura_jerarquia: idJerarquia },
      include: {
        ct_infraestructura_tipo_instancia: incluirTipoInstancia,
      },
    });

    if (!jerarquia) {
      return null;
    }

    // Si tiene dependencia, obtenerla
    if (jerarquia.id_dependencia) {
      const dependencia = await prisma.rl_infraestructura_jerarquia.findUnique({
        where: {
          id_rl_infraestructura_jerarquia: jerarquia.id_dependencia,
        },
        include: {
          ct_infraestructura_tipo_instancia: incluirTipoInstancia,
        },
      });

      return {
        ...jerarquia,
        dependencia,
      };
    }

    return {
      ...jerarquia,
      dependencia: null,
    };
  }

  /**
   * 📊 OBTENER CADENA COMPLETA DE DEPENDENCIAS
   *
   * Obtiene recursivamente todas las dependencias de una jerarquía con los nombres de las instancias
   * para mostrar la cadena completa: Dirección → Departamento → Área → etc.
   */
  async obtenerCadenaCompletaDependencias(idJerarquia: number) {
    const { prisma } = await import("../../config/database");
    const cadena: Array<{
      id_rl_infraestructura_jerarquia: number;
      id_instancia: number;
      nombre_instancia: string;
      tipo_instancia: string;
      nivel: number;
    }> = [];

    // Función recursiva para obtener la cadena completa
    const obtenerDependenciaRecursiva = async (
      idJerarquiaActual: number,
      nivel: number = 0
    ): Promise<void> => {
      const jerarquia = await prisma.rl_infraestructura_jerarquia.findUnique({
        where: { id_rl_infraestructura_jerarquia: idJerarquiaActual },
        include: {
          ct_infraestructura_tipo_instancia: true,
        },
      });

      if (!jerarquia) {
        return;
      }

      // Obtener el nombre de la instancia según su tipo
      let nombreInstancia = "Desconocido";
      try {
        switch (jerarquia.id_ct_infraestructura_tipo_instancia) {
          case 1: // Dirección
            const direccion =
              await prisma.ct_infraestructura_direccion.findUnique({
                where: {
                  id_ct_infraestructura_direccion: jerarquia.id_instancia,
                },
              });
            nombreInstancia = direccion?.nombre || "Desconocido";
            break;
          case 2: // Departamento
            const departamento =
              await prisma.ct_infraestructura_departamento.findUnique({
                where: {
                  id_ct_infraestructura_departamento: jerarquia.id_instancia,
                },
              });
            nombreInstancia = departamento?.nombre || "Desconocido";
            break;
          case 3: // Área
            const area = await prisma.ct_infraestructura_area.findUnique({
              where: { id_ct_infraestructura_area: jerarquia.id_instancia },
            });
            nombreInstancia = area?.nombre || "Desconocido";
            break;
          case 4: // Jefe de Sector
            const jefeSector =
              await prisma.ct_infraestructura_jefe_sector.findUnique({
                where: {
                  id_ct_infraestructura_jefe_sector: jerarquia.id_instancia,
                },
              });
            nombreInstancia = jefeSector?.nombre || "Desconocido";
            break;
          case 5: // Supervisor
            const supervisor =
              await prisma.ct_infraestructura_supervisor.findUnique({
                where: {
                  id_ct_infraestructura_supervisor: jerarquia.id_instancia,
                },
              });
            nombreInstancia = supervisor?.nombre || "Desconocido";
            break;
          case 6: // Escuela
            const escuela = await prisma.ct_infraestructura_escuela.findUnique({
              where: { id_ct_infraestructura_escuela: jerarquia.id_instancia },
            });
            nombreInstancia = escuela?.nombre || "Desconocido";
            break;
          case 7: // Anexo
            const anexo = await prisma.ct_infraestructura_anexo.findUnique({
              where: { id_ct_infraestructura_anexo: jerarquia.id_instancia },
            });
            nombreInstancia = anexo?.nombre || "Desconocido";
            break;
        }
      } catch (error) {
        logger.warn(
          `Error al obtener nombre de instancia para jerarquía ${idJerarquiaActual}:`,
          error
        );
      }

      // Agregar a la cadena (orden: desde la dependencia más lejana hasta la actual)
      cadena.unshift({
        id_rl_infraestructura_jerarquia:
          jerarquia.id_rl_infraestructura_jerarquia,
        id_instancia: jerarquia.id_instancia,
        nombre_instancia: nombreInstancia,
        tipo_instancia: jerarquia.ct_infraestructura_tipo_instancia.nombre,
        nivel,
      });

      // Continuar recursivamente si tiene dependencia
      if (jerarquia.id_dependencia) {
        await obtenerDependenciaRecursiva(jerarquia.id_dependencia, nivel + 1);
      }
    };

    await obtenerDependenciaRecursiva(idJerarquia);
    return cadena;
  }

  // ===========================================
  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅
  // ===========================================
  // BaseService registrará automáticamente CREATE, UPDATE, DELETE
  // en dt_bitacora usando los catálogos de acciones y tablas

  protected registrarEnBitacora = true;
  protected nombreTablaParaBitacora = "rl_infraestructura_jerarquia"; // Nombre exacto de la tabla

  // ✨ ¡CRUD COMPLETO AUTOMÁTICAMENTE!
  // - obtenerTodos() con paginación ✅
  // - obtenerPorId() ✅
  // - crear() con validaciones ✅
  // - actualizar() con verificaciones ✅
  // - eliminar() con manejo de errores ✅
}

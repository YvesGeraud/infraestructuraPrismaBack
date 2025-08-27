/**
 * @fileoverview Servicio de Rl_infraestructura_unidad_nivel usando BaseService
 * Ejemplo de tabla de relación (Rl_) con detección automática de PK
 */

import { BaseService } from "../BaseService";
import { Rl_infraestructura_unidad_nivel } from "@prisma/client";

//TODO ===== SERVICIO PARA RL_INFRAESTRUCTURA_UNIDAD_NIVEL CON BASE SERVICE =====

interface CrearRelacionUnidadNivelInput {
  id_unidad: number;
  id_nivel: number;
  activo?: boolean;
}

interface ActualizarRelacionUnidadNivelInput {
  id_unidad?: number;
  id_nivel?: number;
  activo?: boolean;
}

interface FiltrosRelacionUnidadNivel {
  id_unidad?: number;
  id_nivel?: number;
  activo?: boolean;
}

export class RlInfraestructuraUnidadNivelBaseService extends BaseService<
  Rl_infraestructura_unidad_nivel,
  CrearRelacionUnidadNivelInput,
  ActualizarRelacionUnidadNivelInput,
  FiltrosRelacionUnidadNivel
> {
  // 🔧 Configuración específica del modelo
  protected config = {
    tableName: "rl_infraestructura_unidad_nivel", // ✅ Detección automática: id_infraestructura_unidad_nivel
    defaultOrderBy: { id_unidad: "asc" as const },
  };

  // 🔗 Includes con unidad y nivel
  protected configurarIncludes(filters?: FiltrosRelacionUnidadNivel) {
    return {
      ct_infraestructura_unidad: {
        include: {
          ct_localidad: {
            include: {
              ct_municipio: true,
            },
          },
        },
      },
      ct_infraestructura_nivel: true,
    };
  }

  // 🔍 Filtros específicos para relaciones unidad-nivel
  protected construirWhereClause(filters?: FiltrosRelacionUnidadNivel) {
    const where: any = {};

    if (filters?.id_unidad) {
      where.id_unidad = filters.id_unidad;
    }

    if (filters?.id_nivel) {
      where.id_nivel = filters.id_nivel;
    }

    if (filters?.activo !== undefined) {
      where.activo = filters.activo;
    }

    return where;
  }

  // ✅ NO necesitamos sobreescribir getPrimaryKeyField()
  // El algoritmo detecta: rl_infraestructura_unidad_nivel → id_infraestructura_unidad_nivel

  // ==========================================
  // MÉTODOS ESPECÍFICOS DE RELACIÓN UNIDAD-NIVEL
  // ==========================================

  /**
   * 🏫 Obtener niveles de una unidad específica
   */
  async obtenerNivelesPorUnidad(
    idUnidad: number
  ): Promise<Rl_infraestructura_unidad_nivel[]> {
    try {
      const filtros: FiltrosRelacionUnidadNivel = {
        id_unidad: idUnidad,
        activo: true,
      };
      const resultado = await this.obtenerTodos(filtros, {
        page: 1,
        limit: 100,
      });
      return resultado.data;
    } catch (error) {
      console.error("Error al obtener niveles por unidad:", error);
      throw new Error("Error al obtener niveles por unidad");
    }
  }

  /**
   * 📚 Obtener unidades de un nivel específico
   */
  async obtenerUnidadesPorNivel(
    idNivel: number
  ): Promise<Rl_infraestructura_unidad_nivel[]> {
    try {
      const filtros: FiltrosRelacionUnidadNivel = {
        id_nivel: idNivel,
        activo: true,
      };
      const resultado = await this.obtenerTodos(filtros, {
        page: 1,
        limit: 1000,
      });
      return resultado.data;
    } catch (error) {
      console.error("Error al obtener unidades por nivel:", error);
      throw new Error("Error al obtener unidades por nivel");
    }
  }

  /**
   * 🔗 Crear relación unidad-nivel si no existe
   */
  async crearRelacionSiNoExiste(
    idUnidad: number,
    idNivel: number
  ): Promise<Rl_infraestructura_unidad_nivel> {
    try {
      // Verificar si ya existe la relación
      const existente = await this.model.findFirst({
        where: {
          id_unidad: idUnidad,
          id_nivel: idNivel,
        },
      });

      if (existente) {
        // Si existe pero está inactiva, activarla
        if (!existente.activo) {
          return await this.actualizar(
            existente.id_infraestructura_unidad_nivel,
            {
              activo: true,
            }
          );
        }
        return existente;
      }

      // Si no existe, crearla
      return await this.crear({
        id_unidad: idUnidad,
        id_nivel: idNivel,
        activo: true,
      });
    } catch (error) {
      console.error("Error al crear relación unidad-nivel:", error);
      throw new Error("Error al crear relación unidad-nivel");
    }
  }
}

// 🎉 RESULTADO: Solo 30 líneas para CRUD completo de tabla de relación
// ✅ Detección automática de PK: id_infraestructura_unidad_nivel
// ✅ Incluye relaciones complejas (unidad → localidad → municipio + nivel)
// ✅ Filtros específicos para relaciones many-to-many
// ✅ Métodos de conveniencia para casos de uso típicos
// ✅ Lógica de negocio para evitar duplicados

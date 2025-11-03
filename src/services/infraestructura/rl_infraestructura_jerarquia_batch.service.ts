/**
 * @fileoverview Servicio Batch para rl_infraestructura_jerarquia
 * Permite crear múltiples relaciones jerárquicas de infraestructura en una sola transacción
 */

import { PrismaClient } from "@prisma/client";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";
import { CrearJerarquiaBatchInput } from "../../schemas/infraestructura/rl_infraestructura_jerarquia_batch.schema";
import { ResultadoBatch } from "../inventario/base-batch.service";

const prisma = new PrismaClient();

/**
 * 🔧 CONFIGURACIÓN DE MAPEO DE MODELOS
 * Mapeo estático de tipos de instancia a modelos de Prisma para optimizar búsquedas
 */
interface ModeloConfig {
  modelo: string;
  campoId: string;
}

const MAPEO_MODELOS = new Map<string, ModeloConfig>([
  [
    "direccion",
    {
      modelo: "ct_infraestructura_direccion",
      campoId: "id_ct_infraestructura_direccion",
    },
  ],
  [
    "departamento",
    {
      modelo: "ct_infraestructura_departamento",
      campoId: "id_ct_infraestructura_departamento",
    },
  ],
  [
    "area",
    {
      modelo: "ct_infraestructura_area",
      campoId: "id_ct_infraestructura_area",
    },
  ],
  [
    "jefesector",
    {
      modelo: "ct_infraestructura_jefe_sector",
      campoId: "id_ct_infraestructura_jefe_sector",
    },
  ],
  [
    "jefedesector",
    {
      modelo: "ct_infraestructura_jefe_sector",
      campoId: "id_ct_infraestructura_jefe_sector",
    },
  ],
  [
    "supervisor",
    {
      modelo: "ct_infraestructura_supervisor",
      campoId: "id_ct_infraestructura_supervisor",
    },
  ],
  [
    "escuela",
    {
      modelo: "ct_infraestructura_escuela",
      campoId: "id_ct_infraestructura_escuela",
    },
  ],
  [
    "anexo",
    {
      modelo: "ct_infraestructura_anexo",
      campoId: "id_ct_infraestructura_anexo",
    },
  ],
]);

/**
 * 🎯 SERVICIO BATCH PARA JERARQUÍA DE INFRAESTRUCTURA
 *
 * Crea múltiples registros de rl_infraestructura_jerarquia en una transacción atómica.
 *
 * 📊 ESTRUCTURA:
 * - id_instancia: ID de la instancia específica (ej: ID del jefe de sector)
 * - id_ct_infraestructura_tipo_instancia: Tipo de instancia (ej: 4 = "Jefe de Sector")
 * - id_dependencia: ID de otra entrada en rl_infraestructura_jerarquia (self-reference)
 */
export class RlInfraestructuraJerarquiaBatchService {
  protected prisma = prisma;

  /**
   * 🔍 VALIDAR TIPO DE INSTANCIA
   *
   * Verifica que el tipo de instancia exista y esté activo
   *
   * @param idTipoInstancia - ID del tipo de instancia
   * @param tx - Transacción de Prisma (opcional)
   * @returns Registro del tipo de instancia
   */
  private async validarTipoInstancia(
    idTipoInstancia: number,
    tx?: any
  ): Promise<any> {
    const client = tx || this.prisma;

    const tipoInstancia =
      await client.ct_infraestructura_tipo_instancia.findUnique({
        where: {
          id_ct_infraestructura_tipo_instancia: idTipoInstancia,
          estado: true,
        },
      });

    if (!tipoInstancia) {
      throw createError(
        `El tipo de instancia con ID ${idTipoInstancia} no existe o está inactivo`,
        404
      );
    }

    return tipoInstancia;
  }

  /**
   * 🔍 VALIDAR DEPENDENCIA
   *
   * Verifica que la dependencia exista y esté activa
   *
   * @param idDependencia - ID de la relación jerárquica dependiente
   * @param tx - Transacción de Prisma (opcional)
   * @returns Registro de la dependencia
   */
  private async validarDependencia(
    idDependencia: number | null,
    tx?: any
  ): Promise<any | null> {
    if (idDependencia === null || idDependencia === undefined) {
      return null; // Nivel superior, no tiene dependencia
    }

    const client = tx || this.prisma;

    const dependencia = await client.rl_infraestructura_jerarquia.findUnique({
      where: {
        id_rl_infraestructura_jerarquia: idDependencia,
        estado: true,
      },
    });

    if (!dependencia) {
      throw createError(
        `La dependencia con ID ${idDependencia} no existe o está inactiva`,
        404
      );
    }

    return dependencia;
  }

  /**
   * 🔧 NORMALIZAR NOMBRE DE TIPO
   * Normaliza el nombre del tipo de instancia para comparación flexible
   * Ejemplos: "JEFE DE SECTOR" → "jefedesector", "DIRECCIÓN" → "direccion"
   */
  private normalizarNombreTipo(nombre: string): string {
    return nombre
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/\s+/g, "") // Eliminar espacios
      .replace(/[_-]/g, ""); // Eliminar guiones bajos y guiones
  }

  /**
   * 🔍 OBTENER CONFIGURACIÓN DE MODELO
   * Obtiene la configuración del modelo Prisma para un tipo de instancia normalizado
   */
  private obtenerConfiguracionModelo(
    nombreNormalizado: string
  ): ModeloConfig | null {
    // Búsqueda directa
    let config = MAPEO_MODELOS.get(nombreNormalizado);
    if (config) return config;

    // Búsqueda parcial (optimizada)
    for (const [key, value] of MAPEO_MODELOS.entries()) {
      if (nombreNormalizado.includes(key) || key.includes(nombreNormalizado)) {
        return value;
      }
    }

    return null;
  }

  /**
   * 🔍 VALIDAR INSTANCIA POR TIPO
   * Verifica que la instancia exista en la tabla correspondiente según su tipo
   */
  private async validarInstancia(
    idInstancia: number,
    idTipoInstancia: number,
    tx?: any
  ): Promise<void> {
    const client = tx || this.prisma;
    const tipoInstancia = await this.validarTipoInstancia(idTipoInstancia, tx);
    const nombreNormalizado = this.normalizarNombreTipo(tipoInstancia.nombre);
    const modeloConfig = this.obtenerConfiguracionModelo(nombreNormalizado);

    if (!modeloConfig) {
      throw createError(
        `Tipo de instancia "${tipoInstancia.nombre}" no tiene tabla correspondiente. Tipos válidos: Dirección, Departamento, Área, Jefe de Sector, Supervisor, Escuela, Anexo`,
        400
      );
    }

    // Obtener modelo de Prisma
    const modelo = (client as any)[modeloConfig.modelo];
    if (!modelo || typeof modelo.findUnique !== "function") {
      throw createError(
        `El modelo "${modeloConfig.modelo}" no está disponible en Prisma`,
        500
      );
    }

    // Validar instancia
    try {
      const instancia = await modelo.findUnique({
        where: { [modeloConfig.campoId]: idInstancia },
        select: { [modeloConfig.campoId]: true, estado: true },
      });

      if (!instancia) {
        throw createError(
          `La instancia con ID ${idInstancia} de tipo "${tipoInstancia.nombre}" no existe`,
          404
        );
      }

      if (instancia.estado === false || instancia.estado === null) {
        throw createError(
          `La instancia con ID ${idInstancia} de tipo "${tipoInstancia.nombre}" está inactiva`,
          404
        );
      }
    } catch (error: any) {
      if (error.statusCode) throw error;
      if (error.code === "P2001" || error.code === "P2025") {
        throw createError(
          `No se pudo validar la instancia. Tipo "${tipoInstancia.nombre}" no tiene tabla correspondiente`,
          500
        );
      }
      throw createError(`Error al validar la instancia: ${error.message}`, 500);
    }
  }

  /**
   * 🚀 CREAR BATCH DE JERARQUÍAS
   *
   * Crea múltiples registros de jerarquía en una transacción atómica
   *
   * @param data - Datos del batch de jerarquía
   * @param userId - ID del usuario que ejecuta la acción
   * @param sessionId - ID de la sesión (para bitácora)
   * @returns Resultado de la operación con los registros creados
   */
  async crearBatch(
    data: CrearJerarquiaBatchInput,
    userId: number,
    sessionId: number
  ): Promise<ResultadoBatch> {
    try {
      logger.info(
        `🚀 Iniciando batch de jerarquía para ${data.jerarquias.length} registros`
      );

      const resultado = await this.prisma.$transaction(
        async (tx) => {
          // 📋 VALIDACIONES EN PARALELO (optimizado)
          const tiposUnicos = [
            ...new Set(
              data.jerarquias.map((j) => j.id_ct_infraestructura_tipo_instancia)
            ),
          ];
          const dependenciasUnicas = [
            ...new Set(
              data.jerarquias
                .map((j) => j.id_dependencia)
                .filter((d): d is number => d !== null && d !== undefined)
            ),
          ];

          // Validar tipos, dependencias e instancias en paralelo
          await Promise.all([
            ...tiposUnicos.map((idTipo) =>
              this.validarTipoInstancia(idTipo, tx)
            ),
            ...dependenciasUnicas.map((idDep) =>
              this.validarDependencia(idDep, tx)
            ),
            ...data.jerarquias.map((j) =>
              this.validarInstancia(
                j.id_instancia,
                j.id_ct_infraestructura_tipo_instancia,
                tx
              )
            ),
          ]);

          // 📋 CREAR JERARQUÍAS EN ORDEN SECUENCIAL
          // Crear secuencialmente para resolver dependencias dentro del batch
          const jerarquiasCreadas: any[] = [];
          const mapaJerarquiasCreadas = new Map<string, number>(); // Key: "id_instancia-id_tipo"

          for (const jerarquia of data.jerarquias) {
            const datosCreacion: any = {
              id_instancia: jerarquia.id_instancia,
              id_ct_infraestructura_tipo_instancia:
                jerarquia.id_ct_infraestructura_tipo_instancia,
              estado: true,
              id_ct_usuario_in: userId,
              fecha_in: new Date(),
            };

            // Incluir id_dependencia solo si existe (ya validado)
            if (
              jerarquia.id_dependencia !== null &&
              jerarquia.id_dependencia !== undefined
            ) {
              datosCreacion.id_dependencia = jerarquia.id_dependencia;
            }

            const jerarquiaCreada =
              await tx.rl_infraestructura_jerarquia.create({
                data: datosCreacion,
                include: { ct_infraestructura_tipo_instancia: true },
              });

            // Registrar para posibles dependencias futuras
            const claveMapa = `${jerarquia.id_instancia}-${jerarquia.id_ct_infraestructura_tipo_instancia}`;
            mapaJerarquiasCreadas.set(
              claveMapa,
              jerarquiaCreada.id_rl_infraestructura_jerarquia
            );
            jerarquiasCreadas.push(jerarquiaCreada);
          }

          return {
            success: true,
            message: `Se crearon ${jerarquiasCreadas.length} relaciones jerárquicas exitosamente`,
            data: {
              jerarquias: jerarquiasCreadas,
              total: jerarquiasCreadas.length,
              observaciones: data.observaciones || null,
            },
          };
        },
        {
          maxWait: 30000, // 30 segundos máximo de espera
          timeout: 60000, // 60 segundos máximo de ejecución
        }
      );

      return resultado;
    } catch (error: any) {
      logger.error("❌ Error en batch de jerarquía:", error);

      if (error.statusCode) {
        throw error; // Re-lanzar errores de validación
      }

      throw createError(
        `Error al crear batch de jerarquía: ${
          error.message || "Error desconocido"
        }`,
        500
      );
    }
  }
}

// Exportar instancia única
export default new RlInfraestructuraJerarquiaBatchService();

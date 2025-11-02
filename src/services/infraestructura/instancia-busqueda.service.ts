/**
 * @fileoverview Servicio para búsqueda unificada de instancias de infraestructura
 * Busca por CCT o nombre en todas las tablas: dirección, departamento, área, jefe_sector, supervisor, escuela, anexo
 */

import { PrismaClient } from "@prisma/client";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";

const prisma = new PrismaClient();

/**
 * 🎯 INTERFAZ PARA RESULTADO DE BÚSQUEDA
 */
export interface InstanciaEncontrada {
  id_instancia: number;
  cct: string;
  nombre: string;
  tipo_instancia: {
    id: number;
    nombre: string;
  };
  id_rl_infraestructura_jerarquia: number | null;
  jerarquia?: {
    id_rl_infraestructura_jerarquia: number;
    id_dependencia: number | null;
    tipo_instancia: {
      id: number;
      nombre: string;
    };
  } | null;
  municipio?: {
    cve_mun: string;
    nombre: string;
  } | null;
  total_articulos?: number;
}

/**
 * 🎯 RESPUESTA PAGINADA DE BÚSQUEDA
 */
export interface BusquedaInstanciasRespuesta {
  datos: InstanciaEncontrada[];
  paginacion: {
    pagina: number;
    limite: number;
    total: number;
    totalPaginas: number;
    tieneSiguiente: boolean;
    tieneAnterior: boolean;
  };
}

/**
 * 🎯 SERVICIO DE BÚSQUEDA UNIFICADA DE INSTANCIAS
 */
export class InstanciaBusquedaService {
  protected prisma = prisma;

  /**
   * 🔍 BUSCAR INSTANCIA POR CCT O NOMBRE CON PAGINACIÓN
   *
   * Busca en todas las tablas de instancias:
   * - ct_infraestructura_direccion
   * - ct_infraestructura_departamento
   * - ct_infraestructura_area
   * - ct_infraestructura_jefe_sector
   * - ct_infraestructura_supervisor
   * - ct_infraestructura_escuela
   * - ct_infraestructura_anexo
   *
   * @param busqueda - CCT o nombre a buscar
   * @param opciones - Opciones de búsqueda (paginación, jerarquía, etc.)
   * @returns Respuesta paginada con instancias encontradas
   */
  async buscarPorCctONombre(
    busqueda: string,
    opciones: {
      pagina?: number;
      limite?: number;
      incluirJerarquia?: boolean;
    } = {}
  ): Promise<BusquedaInstanciasRespuesta> {
    try {
      // Validar término de búsqueda
      if (!busqueda || busqueda.trim().length < 2) {
        throw createError(
          "El término de búsqueda debe tener al menos 2 caracteres",
          400
        );
      }

      // Configurar paginación con valores por defecto
      const pagina = opciones.pagina || 1;
      const limite = Math.min(opciones.limite || 10, 100); // Máximo 100 registros
      const incluirJerarquia = opciones.incluirJerarquia ?? true;

      // Validar página
      if (pagina < 1) {
        throw createError("La página debe ser mayor o igual a 1", 400);
      }

      const termino = busqueda.trim();
      const resultados: InstanciaEncontrada[] = [];

      // Obtener todos los tipos de instancia
      const tiposInstancia =
        await prisma.ct_infraestructura_tipo_instancia.findMany({
          where: { estado: true },
        });

      const mapaTipos = new Map(
        tiposInstancia.map((t) => [t.id_ct_infraestructura_tipo_instancia, t])
      );

      // Mapeo de tipos de instancia a tablas y campos
      const tablasInstancias = [
        {
          tabla: "ct_infraestructura_direccion",
          idCampo: "id_ct_infraestructura_direccion",
          tipoId:
            tiposInstancia.find(
              (t) =>
                t.nombre.toLowerCase().includes("dirección") ||
                t.nombre.toLowerCase().includes("direccion")
            )?.id_ct_infraestructura_tipo_instancia || 1,
        },
        {
          tabla: "ct_infraestructura_departamento",
          idCampo: "id_ct_infraestructura_departamento",
          tipoId:
            tiposInstancia.find((t) =>
              t.nombre.toLowerCase().includes("departamento")
            )?.id_ct_infraestructura_tipo_instancia || 2,
        },
        {
          tabla: "ct_infraestructura_area",
          idCampo: "id_ct_infraestructura_area",
          tipoId:
            tiposInstancia.find(
              (t) =>
                t.nombre.toLowerCase().includes("área") ||
                t.nombre.toLowerCase().includes("area")
            )?.id_ct_infraestructura_tipo_instancia || 3,
        },
        {
          tabla: "ct_infraestructura_jefe_sector",
          idCampo: "id_ct_infraestructura_jefe_sector",
          tipoId:
            tiposInstancia.find(
              (t) =>
                t.nombre.toLowerCase().includes("jefe") &&
                t.nombre.toLowerCase().includes("sector")
            )?.id_ct_infraestructura_tipo_instancia || 4,
        },
        {
          tabla: "ct_infraestructura_supervisor",
          idCampo: "id_ct_infraestructura_supervisor",
          tipoId:
            tiposInstancia.find((t) =>
              t.nombre.toLowerCase().includes("supervisor")
            )?.id_ct_infraestructura_tipo_instancia || 5,
        },
        {
          tabla: "ct_infraestructura_escuela",
          idCampo: "id_ct_infraestructura_escuela",
          tipoId:
            tiposInstancia.find((t) =>
              t.nombre.toLowerCase().includes("escuela")
            )?.id_ct_infraestructura_tipo_instancia || 6,
        },
        {
          tabla: "ct_infraestructura_anexo",
          idCampo: "id_ct_infraestructura_anexo",
          tipoId:
            tiposInstancia.find((t) => t.nombre.toLowerCase().includes("anexo"))
              ?.id_ct_infraestructura_tipo_instancia || 7,
        },
      ];

      // Buscar en cada tabla
      for (const configTabla of tablasInstancias) {
        try {
          // @ts-ignore - Prisma dinámico
          const instancias = await prisma[configTabla.tabla].findMany({
            where: {
              estado: true,
              OR: [
                { cct: { contains: termino } },
                { nombre: { contains: termino } },
              ],
            },
            include: {
              dt_infraestructura_ubicacion: {
                include: {
                  ct_localidad: {
                    include: {
                      ct_municipio: true,
                    },
                  },
                },
              },
            },
            take: 50, // Límite por tabla
          });

          // Para cada instancia, buscar su jerarquía y contar artículos
          for (const instancia of instancias) {
            const idInstancia = instancia[configTabla.idCampo];

            // Buscar jerarquía si se solicita
            let jerarquia = null;
            let idJerarquia = null;

            if (incluirJerarquia && configTabla.tipoId) {
              jerarquia = await prisma.rl_infraestructura_jerarquia.findFirst({
                where: {
                  id_instancia: idInstancia,
                  id_ct_infraestructura_tipo_instancia: configTabla.tipoId,
                  estado: true,
                },
                include: {
                  ct_infraestructura_tipo_instancia: true,
                },
              });

              if (jerarquia) {
                idJerarquia = jerarquia.id_rl_infraestructura_jerarquia;
              }
            }

            // Contar artículos si tiene jerarquía
            let totalArticulos = 0;
            if (idJerarquia) {
              totalArticulos = await prisma.dt_inventario_articulo.count({
                where: {
                  id_rl_infraestructura_jerarquia: idJerarquia,
                  estado: true,
                },
              });
            }

            const tipo = mapaTipos.get(configTabla.tipoId);

            resultados.push({
              id_instancia: idInstancia,
              cct: instancia.cct || "",
              nombre: instancia.nombre,
              tipo_instancia: {
                id: configTabla.tipoId,
                nombre: tipo?.nombre || "Desconocido",
              },
              id_rl_infraestructura_jerarquia: idJerarquia,
              jerarquia: jerarquia
                ? {
                    id_rl_infraestructura_jerarquia:
                      jerarquia.id_rl_infraestructura_jerarquia,
                    id_dependencia: jerarquia.id_dependencia,
                    tipo_instancia: {
                      id: jerarquia.ct_infraestructura_tipo_instancia
                        .id_ct_infraestructura_tipo_instancia,
                      nombre:
                        jerarquia.ct_infraestructura_tipo_instancia.nombre,
                    },
                  }
                : null,
              municipio: instancia.dt_infraestructura_ubicacion?.ct_localidad
                ? {
                    cve_mun:
                      instancia.dt_infraestructura_ubicacion.ct_localidad
                        .ct_municipio?.cve_mun || "",
                    nombre:
                      instancia.dt_infraestructura_ubicacion.ct_localidad
                        .ct_municipio?.nombre || "",
                  }
                : null,
              total_articulos: totalArticulos,
            });
          }
        } catch (error: any) {
          logger.warn(
            `⚠️ Error buscando en ${configTabla.tabla}: ${error.message}`
          );
          // Continuar con las demás tablas
        }
      }

      // Ordenar por nombre
      resultados.sort((a, b) => a.nombre.localeCompare(b.nombre));

      // Aplicar paginación
      const total = resultados.length;
      const inicio = (pagina - 1) * limite;
      const fin = inicio + limite;
      const datosPaginados = resultados.slice(inicio, fin);
      const totalPaginas = Math.ceil(total / limite);

      logger.info(
        `🔍 Búsqueda "${termino}": ${total} instancias encontradas (página ${pagina}/${totalPaginas}, mostrando ${datosPaginados.length})`
      );

      return {
        datos: datosPaginados,
        paginacion: {
          pagina,
          limite,
          total,
          totalPaginas,
          tieneSiguiente: pagina < totalPaginas,
          tieneAnterior: pagina > 1,
        },
      };
    } catch (error) {
      logger.error("❌ Error en búsqueda unificada:", error);

      // Si ya es un error creado con createError, re-lanzarlo
      if (error && typeof error === "object" && "statusCode" in error) {
        throw error;
      }

      // Error genérico
      throw createError(
        `Error al buscar instancias: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        500
      );
    }
  }
}

// Exportar instancia única
export default new InstanciaBusquedaService();

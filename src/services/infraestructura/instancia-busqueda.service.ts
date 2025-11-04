/**
 * @fileoverview Servicio de búsqueda unificada de instancias de infraestructura
 * Busca por CCT o nombre en todas las tablas: dirección, departamento, área, jefe_sector, supervisor, escuela, anexo
 * 
 * NOTA: Este servicio no extiende de BaseService porque su funcionalidad es especializada
 * (búsqueda unificada en múltiples tablas), pero mantiene la misma estructura y patrones.
 */

import { prisma } from "../../config/database";
import { createError } from "../../middleware/errorHandler";
import logger from "../../config/logger";

//TODO ===== SERVICIO DE BÚSQUEDA UNIFICADA DE INSTANCIAS DE INFRAESTRUCTURA =====

/**
 * 🎯 INTERFACES ESPECIALIZADAS PARA BÚSQUEDA UNIFICADA
 * 
 * NOTA: Estos servicios especializados requieren interfaces personalizadas porque:
 * - Combina datos de múltiples tablas (direcciones, departamentos, áreas, etc.)
 * - Agrega información adicional (jerarquía, municipio, total_articulos)
 * - No puede usar directamente los tipos de Prisma ya que el resultado es una agregación
 * 
 * Los servicios normales (que extienden BaseService) usan tipos de Prisma directamente
 * desde @prisma/client, pero este servicio necesita estas interfaces personalizadas.
 */

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
 * 
 * Este servicio proporciona búsqueda unificada en múltiples tablas de instancias
 * de infraestructura (direcciones, departamentos, áreas, etc.)
 */
export class InstanciaBusquedaService {

  /**
   * 🔍 BUSCAR INSTANCIA POR CCT O NOMBRE CON PAGINACIÓN
   *
   * Busca en todas las tablas de instancias de infraestructura:
   * - ct_infraestructura_direccion (tipoId: 1)
   * - ct_infraestructura_departamento (tipoId: 2)
   * - ct_infraestructura_area (tipoId: 3)
   * - ct_infraestructura_jefe_sector (tipoId: 4)
   * - ct_infraestructura_supervisor (tipoId: 5)
   * - ct_infraestructura_escuela (tipoId: 6)
   * - ct_infraestructura_anexo (tipoId: 7)
   *
   * @param busqueda - CCT o nombre a buscar (mínimo 2 caracteres)
   * @param opciones - Opciones de búsqueda (paginación, jerarquía, etc.)
   * @returns Respuesta paginada con instancias encontradas
   * @throws {Error} Si el término de búsqueda es inválido o hay error en la consulta
   */
  async buscarPorCctONombre(
    busqueda: string,
    opciones: {
      pagina?: number;
      limite?: number;
      incluirJerarquia?: boolean;
      tipoInstanciaId?: number; // Filtro opcional por tipo de instancia
    } = {}
  ): Promise<BusquedaInstanciasRespuesta> {
    try {
      // Configurar paginación con valores por defecto
      const pagina = opciones.pagina || 1;
      const limite = Math.min(opciones.limite || 10, 100); // Máximo 100 registros
      const incluirJerarquia = opciones.incluirJerarquia ?? true;
      const tipoInstanciaId = opciones.tipoInstanciaId;

      // Validar página
      if (pagina < 1) {
        throw createError("La página debe ser mayor o igual a 1", 400);
      }

      // Si el término es "*", buscar todos los registros (sin filtro de búsqueda)
      const termino = busqueda.trim();
      const esBuscarTodos = termino === "*" || termino === "";
      
      // Validar término de búsqueda (mínimo 1 carácter, excepto cuando se busca todos)
      if (!esBuscarTodos && (!termino || termino.length < 1)) {
        throw createError(
          "El término de búsqueda debe tener al menos 1 carácter",
          400
        );
      }
      const resultados: InstanciaEncontrada[] = [];

      // Obtener todos los tipos de instancia para construir el mapa de nombres
      const tiposInstancia =
        await prisma.ct_infraestructura_tipo_instancia.findMany({
          where: { estado: true },
        });

      const mapaTipos = new Map(
        tiposInstancia.map((t) => [t.id_ct_infraestructura_tipo_instancia, t])
      );

      // 🎯 Mapeo directo de tablas a IDs de tipos de instancia del catálogo
      // Los IDs son fijos según el catálogo ct_infraestructura_tipo_instancia:
      // 1 = DIRECCIÓN, 2 = DEPARTAMENTO, 3 = AREA, 4 = JEFE DE SECTOR,
      // 5 = SUPERVISOR, 6 = ESCUELA, 7 = ANEXO
      const tablasInstancias = [
        {
          tabla: "ct_infraestructura_direccion",
          idCampo: "id_ct_infraestructura_direccion",
          tipoId: 1, // DIRECCIÓN
        },
        {
          tabla: "ct_infraestructura_departamento",
          idCampo: "id_ct_infraestructura_departamento",
          tipoId: 2, // DEPARTAMENTO
        },
        {
          tabla: "ct_infraestructura_area",
          idCampo: "id_ct_infraestructura_area",
          tipoId: 3, // AREA
        },
        {
          tabla: "ct_infraestructura_jefe_sector",
          idCampo: "id_ct_infraestructura_jefe_sector",
          tipoId: 4, // JEFE DE SECTOR
        },
        {
          tabla: "ct_infraestructura_supervisor",
          idCampo: "id_ct_infraestructura_supervisor",
          tipoId: 5, // SUPERVISOR
        },
        {
          tabla: "ct_infraestructura_escuela",
          idCampo: "id_ct_infraestructura_escuela",
          tipoId: 6, // ESCUELA
        },
        {
          tabla: "ct_infraestructura_anexo",
          idCampo: "id_ct_infraestructura_anexo",
          tipoId: 7, // ANEXO
        },
      ];

      // Si se especifica un tipo de instancia, filtrar solo esa tabla
      const tablasABuscar = tipoInstanciaId
        ? tablasInstancias.filter((t) => t.tipoId === tipoInstanciaId)
        : tablasInstancias;

      if (tipoInstanciaId && tablasABuscar.length === 0) {
        throw createError(
          `Tipo de instancia con ID ${tipoInstanciaId} no válido`,
          400
        );
      }

      // Buscar en cada tabla
      for (const configTabla of tablasABuscar) {
        try {
          // Construir condición where según si se busca todos o un término específico
          const whereCondition: any = {
            estado: true,
          };

          if (!esBuscarTodos) {
            // Si no es buscar todos, aplicar filtro de búsqueda
            whereCondition.OR = [
              { cct: { contains: termino } },
              { nombre: { contains: termino } },
            ];
          }

          // @ts-ignore - Prisma dinámico
          const instancias = await prisma[configTabla.tabla].findMany({
            where: whereCondition,
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

// Exportar instancia única (patrón singleton)
const instanciaBusquedaService = new InstanciaBusquedaService();
export default instanciaBusquedaService;

/**
 * @fileoverview Servicio de localidades
 * Implementa la interfaz IServicioLocalidad para garantizar todos los métodos necesarios
 * Trabaja con la estructura real de la base de datos
 */

import { initModels } from "../models/init-models";
import { sequelize } from "../config/database";
import { Transaction, Op } from "sequelize";
import {
  IServicioLocalidad,
  Localidad,
  DatosCrearLocalidad,
  DatosActualizarLocalidad,
  FiltrosLocalidad,
} from "../interfaces/ct_localidad.interface";
import {
  CrearLocalidadInput,
  ActualizarLocalidadInput,
  ConsultaLocalidadInput,
  consultaLocalidadSchema,
} from "../schemas/localidad.schemas";
import { CodigosError } from "../types/response.types";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const {
  ct_localidad: LocalidadModel,
  ct_municipio: MunicipioModel,
  ct_entidad: EntidadModel,
  ct_codigo_postal: CodigoPostalModel,
} = models;

/**
 * Errores personalizados del servicio de localidades
 */
class ErrorServicioLocalidad extends Error {
  public readonly codigo: string;

  constructor(
    mensaje: string,
    codigo: string = CodigosError.ERROR_INTERNO_SERVIDOR
  ) {
    super(mensaje);
    this.name = "ErrorServicioLocalidad";
    this.codigo = codigo;
  }
}

/**
 * Interface para la respuesta de localidad
 */
interface LocalidadRespuesta {
  id_localidad: number;
  localidad: string;
  ambito: string;
  id_municipio: number;
  municipio?: {
    id_municipio: number;
    nombre: string;
    cve_mun: string;
    entidad?: {
      id_entidad: number;
      nombre: string;
      abreviatura: string;
    };
  };
  codigos_postales?: Array<{
    id_codigo_postal: number;
    codigo_postal: string;
    asentamiento: string;
  }>;
}

/**
 * Servicio de localidades que implementa la interfaz IServicioLocalidad
 */
class CtLocalidadService implements IServicioLocalidad {
  /**
   * Obtener todas las localidades con filtros opcionales
   */
  async obtenerTodos(filtros?: FiltrosLocalidad): Promise<Localidad[]> {
    try {
      let whereClause: any = {};

      // Aplicar filtros si existen
      if (filtros?.buscar) {
        whereClause.localidad = {
          [Op.like]: `%${filtros.buscar}%`,
        };
      }

      if (filtros?.ambito) {
        whereClause.ambito = filtros.ambito;
      }

      if (filtros?.idMunicipio) {
        whereClause.id_municipio = filtros.idMunicipio;
      }

      // Configurar includes dinámicamente
      const includeArray: any[] = [];

      if (filtros?.incluirMunicipio) {
        const municipioInclude: any = {
          model: MunicipioModel,
          as: "id_municipio_ct_municipio",
          attributes: ["id_municipio", "nombre", "cve_mun"],
          include: [
            {
              model: EntidadModel,
              as: "id_entidad_ct_entidad",
              attributes: ["id_entidad", "nombre", "abreviatura"],
            },
          ],
        };
        includeArray.push(municipioInclude);
      }

      const localidades = await LocalidadModel.findAll({
        where: whereClause,
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: includeArray,
        order: [["localidad", "ASC"]],
        // Paginación si se especifica
        ...(filtros?.limite && {
          limit: filtros.limite,
          offset: filtros.pagina ? (filtros.pagina - 1) * filtros.limite : 0,
        }),
      });

      if (localidades.length === 0) {
        return []; // Retornar array vacío en lugar de error
      }

      // Mapear a la interfaz Localidad
      const resultado: Localidad[] = [];

      for (const loc of localidades) {
        const localidad: Localidad = {
          id: loc.id_localidad,
          nombre: loc.localidad || "",
          ambito: loc.ambito || "R",
          idMunicipio: loc.id_municipio || 0,
        };

        // Agregar información del municipio si está incluida
        if (loc.id_municipio_ct_municipio) {
          localidad.municipio = {
            id: loc.id_municipio_ct_municipio.id_municipio,
            nombre: loc.id_municipio_ct_municipio.nombre || "",
            cveMun: loc.id_municipio_ct_municipio.cve_mun || "",
          };

          // Agregar entidad si está incluida
          if (loc.id_municipio_ct_municipio.id_entidad_ct_entidad) {
            localidad.municipio.entidad = {
              id: loc.id_municipio_ct_municipio.id_entidad_ct_entidad.id_entidad,
              nombre: loc.id_municipio_ct_municipio.id_entidad_ct_entidad.nombre || "",
              abreviatura: loc.id_municipio_ct_municipio.id_entidad_ct_entidad.abreviatura,
            };
          }
        }

        // Si se solicitan códigos postales, obtenerlos por separado
        if (filtros?.incluirCodigosPostales) {
          const codigosPostales = await CodigoPostalModel.findAll({
            where: { id_localidad: loc.id_localidad },
            attributes: ["id_codigo_postal", "codigo_postal", "asentamiento"],
            order: [["codigo_postal", "ASC"]],
          });

          localidad.codigosPostales = codigosPostales.map((cp: any) => ({
            id: cp.id_codigo_postal,
            codigoPostal: cp.codigo_postal || "",
            asentamiento: cp.asentamiento,
          }));
        }

        resultado.push(localidad);
      }

      return resultado;
    } catch (error) {
      console.error("Error al obtener localidades:", error);
      throw new Error("Error al obtener localidades");
    }
  }

  /**
   * Obtener una localidad por ID
   */
  async obtenerPorId(id: number): Promise<Localidad | null> {
    try {
      const localidad = await LocalidadModel.findByPk(id, {
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
      });

      if (!localidad) {
        return null;
      }

      return {
        id: localidad.id_localidad,
        nombre: localidad.localidad || "",
        ambito: localidad.ambito || "R",
        idMunicipio: localidad.id_municipio || 0,
      };
    } catch (error) {
      console.error("Error al obtener localidad por ID:", error);
      throw new Error("Error al obtener localidad");
    }
  }

  /**
   * Crear una nueva localidad
   */
  async crear(datos: DatosCrearLocalidad): Promise<Localidad> {
    try {
      // Verificar si ya existe una localidad con el mismo nombre en el municipio
      const localidadExistente = await LocalidadModel.findOne({
        where: {
          localidad: datos.nombre,
          id_municipio: datos.idMunicipio,
        },
      });

      if (localidadExistente) {
        throw new Error("Ya existe una localidad con este nombre en el municipio");
      }

      // Verificar que el municipio existe
      const municipioExiste = await MunicipioModel.findByPk(datos.idMunicipio);
      if (!municipioExiste) {
        throw new Error(`El municipio con ID ${datos.idMunicipio} no existe`);
      }

      // Crear la localidad
      const nuevaLocalidad = await LocalidadModel.create({
        localidad: datos.nombre,
        ambito: datos.ambito,
        id_municipio: datos.idMunicipio,
      });

      return {
        id: nuevaLocalidad.id_localidad,
        nombre: nuevaLocalidad.localidad || "",
        ambito: nuevaLocalidad.ambito || "R",
        idMunicipio: nuevaLocalidad.id_municipio || 0,
      };
    } catch (error) {
      console.error("Error al crear localidad:", error);
      throw error;
    }
  }

  /**
   * Actualizar una localidad existente
   */
  async actualizar(id: number, datos: DatosActualizarLocalidad): Promise<Localidad> {
    try {
      const localidad = await LocalidadModel.findByPk(id);

      if (!localidad) {
        throw new Error("Localidad no encontrada");
      }

      // Si se está actualizando el municipio, verificar que existe
      if (datos.idMunicipio) {
        const municipioExiste = await MunicipioModel.findByPk(datos.idMunicipio);
        if (!municipioExiste) {
          throw new Error(`El municipio con ID ${datos.idMunicipio} no existe`);
        }
      }

      // Si se está actualizando el nombre, verificar duplicados
      if (datos.nombre) {
        const municipioId = datos.idMunicipio || localidad.id_municipio;
        const localidadExistente = await LocalidadModel.findOne({
          where: {
            localidad: datos.nombre,
            id_municipio: municipioId,
            id_localidad: { [Op.ne]: id },
          },
        });

        if (localidadExistente) {
          throw new Error("Ya existe una localidad con ese nombre en el municipio especificado");
        }
      }

      await localidad.update({
        ...(datos.nombre && { localidad: datos.nombre }),
        ...(datos.ambito && { ambito: datos.ambito }),
        ...(datos.idMunicipio && { id_municipio: datos.idMunicipio }),
      });

      return {
        id: localidad.id_localidad,
        nombre: localidad.localidad || "",
        ambito: localidad.ambito || "R",
        idMunicipio: localidad.id_municipio || 0,
      };
    } catch (error) {
      console.error("Error al actualizar localidad:", error);
      throw error;
    }
  }

  /**
   * Eliminar una localidad
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      const localidad = await LocalidadModel.findByPk(id);

      if (!localidad) {
        return false;
      }

      await localidad.destroy();
      return true;
    } catch (error) {
      console.error("Error al eliminar localidad:", error);
      throw new Error("Error al eliminar localidad");
    }
  }

  /**
   * Buscar localidades por nombre
   */
  async buscarPorNombre(nombre: string): Promise<Localidad[]> {
    const filtros: FiltrosLocalidad = { buscar: nombre };
    return await this.obtenerTodos(filtros);
  }

  /**
   * Obtener localidades por municipio
   */
  async obtenerPorMunicipio(idMunicipio: number): Promise<Localidad[]> {
    const filtros: FiltrosLocalidad = { idMunicipio };
    return await this.obtenerTodos(filtros);
  }

  /**
   * Obtener localidades urbanas
   */
  async obtenerUrbanas(): Promise<Localidad[]> {
    const filtros: FiltrosLocalidad = { ambito: "U" };
    return await this.obtenerTodos(filtros);
  }

  /**
   * Obtener localidades rurales
   */
  async obtenerRurales(): Promise<Localidad[]> {
    const filtros: FiltrosLocalidad = { ambito: "R" };
    return await this.obtenerTodos(filtros);
  }

  // ==========================================
  // MÉTODOS LEGACY PARA COMPATIBILIDAD
  // ==========================================

  /**
   * Obtener localidades con filtros avanzados (legacy)
   * @param filtros - Filtros de consulta validados
   */
  async obtenerLocalidades(filtros?: ConsultaLocalidadInput): Promise<any[]> {
    try {
      // Construir condiciones de búsqueda
      const whereConditions: any = {};

      // Filtrar por municipio
      if (filtros?.idMunicipio) {
        whereConditions.id_municipio = filtros.idMunicipio;
      }

      // Filtrar por ámbito (Rural/Urbano)
      if (filtros?.ambito) {
        whereConditions.ambito = filtros.ambito;
      }

      // Filtrar por término de búsqueda en nombre
      if (filtros?.buscar) {
        whereConditions.localidad = {
          [Op.like]: `%${filtros.buscar}%`,
        };
      }

      // Configurar includes dinámicamente
      const includeArray: any[] = [];

      if (filtros?.incluirMunicipio) {
        const municipioInclude: any = {
          model: MunicipioModel,
          as: "id_municipio_ct_municipio",
          attributes: ["id_municipio", "nombre", "cve_mun"],
        };

        // Si también se solicita incluir entidad
        if (filtros?.incluirMunicipio) {
          municipioInclude.include = [
            {
              model: EntidadModel,
              as: "id_entidad_ct_entidad",
              attributes: ["id_entidad", "nombre", "abreviatura"],
            },
          ];
        }

        includeArray.push(municipioInclude);
      }

      const localidades = await LocalidadModel.findAll({
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        where: whereConditions,
        include: includeArray,
        order: [["localidad", "ASC"]],
      });

      // Retornar directamente los resultados de Sequelize
      return localidades;
    } catch (error) {
      throw new ErrorServicioLocalidad(
        `Error al obtener localidades: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Obtener una localidad por ID con opciones de inclusión
   * @param parametros - Parámetros validados que contienen el ID
   * @param filtros - Filtros para incluir relaciones
   */
  async obtenerLocalidadPorId(
    parametros: { id: number },
    filtros?: ConsultaLocalidadInput
  ): Promise<any | null> {
    try {
      // Configurar includes dinámicamente
      const includeArray: any[] = [];

      if (filtros?.incluirMunicipio) {
        const municipioInclude: any = {
          model: MunicipioModel,
          as: "id_municipio_ct_municipio",
          attributes: ["id_municipio", "nombre", "cve_mun"],
        };

        includeArray.push(municipioInclude);
      }

      const localidad = await LocalidadModel.findByPk(parametros.id, {
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: includeArray,
      });

      if (!localidad) {
        return null;
      }

      // Si se solicitan códigos postales, obtenerlos por separado
      if (filtros?.incluirCodigosPostales) {
        const codigosPostales = await CodigoPostalModel.findAll({
          where: { id_localidad: parametros.id },
          attributes: ["id_codigo_postal", "codigo_postal", "asentamiento"],
          order: [["codigo_postal", "ASC"]],
        });

        return {
          ...localidad.toJSON(),
          codigos_postales: codigosPostales,
        };
      }

      return localidad;
    } catch (error) {
      throw new ErrorServicioLocalidad(
        `Error al obtener localidad: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Validar parámetros de consulta usando el schema
   * @param query - Query parameters a validar
   */
  validarParametrosConsulta(query: any): ConsultaLocalidadInput {
    try {
      return consultaLocalidadSchema.parse(query);
    } catch (error) {
      throw new ErrorServicioLocalidad(
        "Parámetros de consulta inválidos",
        CodigosError.ERROR_VALIDACION
      );
    }
  }

  /**
   * Obtener una localidad completa con municipio y códigos postales
   * @param id - ID de la localidad
   * @returns Localidad completa con relaciones
   */
  async obtenerLocalidadCompleta(id: number) {
    try {
      const localidad = await LocalidadModel.findByPk(id, {
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: MunicipioModel,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun", "id_entidad"],
            include: [
              {
                model: EntidadModel,
                as: "id_entidad_ct_entidad",
                attributes: ["id_entidad", "nombre", "abreviatura"],
              },
            ],
          },
        ],
      });

      if (!localidad) {
        throw new ErrorServicioLocalidad(
          "Localidad no encontrada",
          CodigosError.RECURSO_NO_ENCONTRADO
        );
      }

      // Buscar códigos postales asociados a esta localidad
      const codigosPostales = await CodigoPostalModel.findAll({
        where: { id_localidad: id },
        attributes: ["id_codigo_postal", "codigo_postal", "asentamiento"],
        order: [["codigo_postal", "ASC"]],
      });

      // Agregar los códigos postales al resultado
      const resultado = {
        ...localidad.toJSON(),
        codigos_postales: codigosPostales,
      };

      return resultado;
    } catch (error) {
      if (error instanceof ErrorServicioLocalidad) {
        throw error;
      }

      throw new ErrorServicioLocalidad(
        `Error al obtener localidad completa: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Crear una nueva localidad con auditoría
   * @param datos - Datos de la localidad a crear
   * @returns Nueva localidad creada
   */
  async crearLocalidad(datos: CrearLocalidadInput) {
    // Usar transacción para garantizar consistencia
    return await sequelize.transaction(async (t: Transaction) => {
      try {
        // 1. Verificar si ya existe (dentro de la transacción)
        const localidadExistente = await LocalidadModel.findOne({
          where: {
            localidad: datos.nombre,
            id_municipio: datos.idMunicipio,
          },
          transaction: t, // ← Importante: usar la transacción
        });

        if (localidadExistente) {
          throw new ErrorServicioLocalidad(
            "Ya existe una localidad con este nombre en el municipio",
            CodigosError.RECURSO_YA_EXISTE
          );
        }

        // 2. Crear la localidad
        const nuevaLocalidad = await LocalidadModel.create({
          localidad: datos.nombre,
          ambito: datos.ambito,
          id_municipio: datos.idMunicipio,
        }, {
          transaction: t, // ← Importante: usar la transacción
        });

        // 3. Crear log de auditoría (ejemplo ficticio)
        // En tu caso real, usa la tabla de auditoría que tengas
        console.log(
          `[AUDITORIA] Localidad creada: ${nuevaLocalidad.id_localidad}`
        );

        // Si tuvieras tabla de auditoría:
        // await TablaAuditoria.create({
        //   tabla: 'ct_localidad',
        //   accion: 'CREATE',
        //   id_registro: nuevaLocalidad.id_localidad,
        //   datos: JSON.stringify(nuevaLocalidad),
        //   fecha: new Date()
        // }, { transaction: t });

        // 4. Si llegamos aquí, todo fue exitoso
        return nuevaLocalidad;
      } catch (error) {
        // Si hay cualquier error, se hace rollback automático
        if (error instanceof ErrorServicioLocalidad) {
          throw error; // Re-lanzar errores personalizados
        }

        throw new ErrorServicioLocalidad(
          `Error al crear localidad: ${
            error instanceof Error ? error.message : "Error desconocido"
          }`,
          CodigosError.ERROR_BASE_DATOS
        );
      }
    });
  }

  /**
   * Actualizar una localidad existente
   * @param id - ID de la localidad
   * @param datos - Datos a actualizar validados por Zod
   * @returns Localidad actualizada
   */
  async actualizarLocalidad(id: number, datos: ActualizarLocalidadInput) {
    try {
      const localidad = await LocalidadModel.findByPk(id);

      if (!localidad) {
        throw new ErrorServicioLocalidad(
          "Localidad no encontrada",
          CodigosError.RECURSO_NO_ENCONTRADO
        );
      }

      // Si se está actualizando el municipio, verificar que exista
      if (datos.idMunicipio) {
        const municipioExiste = await MunicipioModel.findByPk(datos.idMunicipio);
        if (!municipioExiste) {
          throw new ErrorServicioLocalidad(
            "El municipio especificado no existe",
            CodigosError.RECURSO_NO_ENCONTRADO
          );
        }
      }

      // Si se está actualizando el nombre, verificar duplicados
      if (datos.nombre) {
        const municipioId = datos.idMunicipio || localidad.id_municipio;
        const localidadExistente = await LocalidadModel.findOne({
          where: {
            localidad: datos.nombre,
            id_municipio: municipioId,
            id_localidad: { [Op.ne]: id },
          },
        });

        if (localidadExistente) {
          throw new ErrorServicioLocalidad(
            "Ya existe una localidad con ese nombre en el municipio especificado",
            CodigosError.RECURSO_YA_EXISTE
          );
        }
      }

      await localidad.update({
        ...(datos.nombre && { localidad: datos.nombre }),
        ...(datos.ambito && { ambito: datos.ambito }),
        ...(datos.idMunicipio && { id_municipio: datos.idMunicipio }),
      });
      return localidad;
    } catch (error) {
      if (error instanceof ErrorServicioLocalidad) {
        throw error;
      }

      throw new ErrorServicioLocalidad(
        `Error al actualizar localidad: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Eliminar una localidad
   * @param id - ID de la localidad
   * @returns true si se eliminó correctamente
   */
  async eliminarLocalidad(id: number) {
    try {
      const localidad = await LocalidadModel.findByPk(id);

      if (!localidad) {
        throw new ErrorServicioLocalidad(
          "Localidad no encontrada",
          CodigosError.RECURSO_NO_ENCONTRADO
        );
      }

      // Verificar si tiene registros dependientes
      const tieneUnidades = await models.ct_infraestructura_unidad.count({
        where: { id_localidad: id },
      });

      if (tieneUnidades > 0) {
        throw new ErrorServicioLocalidad(
          "No se puede eliminar la localidad porque tiene unidades de infraestructura asociadas",
          CodigosError.CONFLICTO
        );
      }

      await localidad.destroy();
      return true;
    } catch (error) {
      if (error instanceof ErrorServicioLocalidad) {
        throw error;
      }

      throw new ErrorServicioLocalidad(
        `Error al eliminar localidad: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Obtener localidades por municipio
   * @param idMunicipio - ID del municipio
   * @returns Array de localidades del municipio
   */
  async obtenerLocalidadesPorMunicipio(idMunicipio: number): Promise<any[]> {
    try {
      const localidades = await LocalidadModel.findAll({
        where: { id_municipio: idMunicipio },
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: MunicipioModel,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun"],
          },
        ],
        order: [["localidad", "ASC"]],
      });

      return localidades;
    } catch (error) {
      throw new ErrorServicioLocalidad(
        `Error al obtener localidades del municipio ${idMunicipio}: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Obtiene localidades urbanas
   */
  async obtenerLocalidadesUrbanas(): Promise<any[]> {
    try {
      const localidades = await LocalidadModel.findAll({
        where: { ambito: "U" },
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: MunicipioModel,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun"],
          },
        ],
        order: [["localidad", "ASC"]],
      });

      return localidades;
    } catch (error) {
      throw new ErrorServicioLocalidad(
        `Error al obtener localidades urbanas: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Obtiene localidades rurales
   */
  async obtenerLocalidadesRurales(): Promise<any[]> {
    try {
      const localidades = await LocalidadModel.findAll({
        where: { ambito: "R" },
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: MunicipioModel,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun"],
          },
        ],
        order: [["localidad", "ASC"]],
      });

      return localidades;
    } catch (error) {
      throw new ErrorServicioLocalidad(
        `Error al obtener localidades rurales: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  /**
   * Busca localidades por nombre
   */
  async buscarLocalidadesPorNombre(termino: string): Promise<any[]> {
    try {
      const localidades = await LocalidadModel.findAll({
        where: {
          localidad: {
            [Op.like]: `%${termino}%`,
          },
        },
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: MunicipioModel,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun"],
          },
        ],
        order: [["localidad", "ASC"]],
      });

      return localidades;
    } catch (error) {
      throw new ErrorServicioLocalidad(
        `Error al buscar localidades con término "${termino}": ${
          error instanceof Error ? error.message : "Error desconocido"
        }`,
        CodigosError.ERROR_BASE_DATOS
      );
    }
  }

  // ========================================================================
  // MÉTODOS LEGACY - Mantener por compatibilidad (DEPRECATED)
  // Se recomienda usar obtenerLocalidades() con filtros
  // ========================================================================

  /**
   * @deprecated Usar obtenerLocalidades() con filtros
   */
  async obtenerTodasLasLocalidades(): Promise<any[]> {
    return this.obtenerLocalidades();
  }
}

export default new CtLocalidadService();
export { ErrorServicioLocalidad };

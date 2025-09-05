/**
 * @fileoverview Servicio de códigos postales
 * Implementa la interfaz IServicioCodigoPostal para garantizar todos los métodos necesarios
 * Trabaja con la estructura real de la base de datos
 */

import { initModels } from "../models/init-models";
import { sequelize } from "../config/database";
import { Op } from "sequelize";
import {
  IServicioCodigoPostal,
  CodigoPostal,
  DatosCrearCodigoPostal,
  DatosActualizarCodigoPostal,
  FiltrosCodigoPostal,
} from "../interfaces/ct_codigo_postal.interface";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const {
  ct_codigo_postal: CodigoPostalModel,
  ct_localidad: LocalidadModel,
  ct_municipio: MunicipioModel,
  ct_entidad: EntidadModel,
} = models;

/**
 * Servicio de códigos postales que implementa la interfaz IServicioCodigoPostal
 */
class CtCodigoPostalService implements IServicioCodigoPostal {
  /**
   * Obtener todos los códigos postales con filtros opcionales
   */
  async obtenerTodos(filtros?: FiltrosCodigoPostal): Promise<CodigoPostal[]> {
    try {
      let whereClause: any = {};

      // Aplicar filtros si existen
      if (filtros?.buscar) {
        whereClause = {
          [Op.or]: [
            { codigo_postal: { [Op.like]: `%${filtros.buscar}%` } },
            { asentamiento: { [Op.like]: `%${filtros.buscar}%` } },
          ],
        };
      }

      if (filtros?.codigoPostal) {
        whereClause.codigo_postal = filtros.codigoPostal;
      }

      if (filtros?.asentamiento) {
        whereClause.asentamiento = { [Op.like]: `%${filtros.asentamiento}%` };
      }

      if (filtros?.idLocalidad) {
        whereClause.id_localidad = filtros.idLocalidad;
      }

      const codigosPostales = await CodigoPostalModel.findAll({
        where: whereClause,
        attributes: [
          "id_codigo_postal",
          "codigo_postal",
          "asentamiento",
          "id_localidad",
        ],
        order: [["codigo_postal", "ASC"]],
        // Paginación si se especifica
        ...(filtros?.limite && {
          limit: filtros.limite,
          offset: filtros.pagina ? (filtros.pagina - 1) * filtros.limite : 0,
        }),
      });

      if (codigosPostales.length === 0) {
        return []; // Retornar array vacío en lugar de error
      }

      // Mapear a la interfaz CodigoPostal
      return codigosPostales.map((cp: any) => ({
        id: cp.id_codigo_postal,
        codigoPostal: cp.codigo_postal || "",
        asentamiento: cp.asentamiento,
        idLocalidad: cp.id_localidad,
      }));
    } catch (error) {
      console.error("Error al obtener códigos postales:", error);
      throw new Error("Error al obtener códigos postales");
    }
  }

  /**
   * Obtener un código postal por ID
   */
  async obtenerPorId(id: number): Promise<CodigoPostal | null> {
    try {
      const codigoPostal = await CodigoPostalModel.findByPk(id, {
        attributes: [
          "id_codigo_postal",
          "codigo_postal",
          "asentamiento",
          "id_localidad",
        ],
      });

      if (!codigoPostal) {
        return null;
      }

      return {
        id: codigoPostal.id_codigo_postal,
        codigoPostal: codigoPostal.codigo_postal || "",
        asentamiento: codigoPostal.asentamiento,
        idLocalidad: codigoPostal.id_localidad,
      };
    } catch (error) {
      console.error("Error al obtener código postal por ID:", error);
      throw new Error("Error al obtener código postal");
    }
  }

  /**
   * Crear un nuevo código postal
   */
  async crear(datos: DatosCrearCodigoPostal): Promise<CodigoPostal> {
    try {
      // Si se especifica una localidad, verificar que existe
      if (datos.idLocalidad) {
        const localidadExiste = await LocalidadModel.findByPk(datos.idLocalidad);
        if (!localidadExiste) {
          throw new Error(`La localidad con ID ${datos.idLocalidad} no existe`);
        }
      }

      // Crear el código postal
      const nuevoCodigoPostal = await CodigoPostalModel.create({
        codigo_postal: datos.codigoPostal,
        asentamiento: datos.asentamiento,
        id_localidad: datos.idLocalidad,
      });

      return {
        id: nuevoCodigoPostal.id_codigo_postal,
        codigoPostal: nuevoCodigoPostal.codigo_postal || "",
        asentamiento: nuevoCodigoPostal.asentamiento,
        idLocalidad: nuevoCodigoPostal.id_localidad,
      };
    } catch (error) {
      console.error("Error al crear código postal:", error);
      throw new Error("Error al crear código postal");
    }
  }

  /**
   * Actualizar un código postal existente
   */
  async actualizar(id: number, datos: DatosActualizarCodigoPostal): Promise<CodigoPostal> {
    try {
      const codigoPostal = await CodigoPostalModel.findByPk(id);

      if (!codigoPostal) {
        throw new Error("Código postal no encontrado");
      }

      // Si se especifica una nueva localidad, verificar que existe
      if (datos.idLocalidad) {
        const localidadExiste = await LocalidadModel.findByPk(datos.idLocalidad);
        if (!localidadExiste) {
          throw new Error(`La localidad con ID ${datos.idLocalidad} no existe`);
        }
      }

      await codigoPostal.update({
        ...(datos.codigoPostal && { codigo_postal: datos.codigoPostal }),
        ...(datos.asentamiento && { asentamiento: datos.asentamiento }),
        ...(datos.idLocalidad && { id_localidad: datos.idLocalidad }),
      });

      return {
        id: codigoPostal.id_codigo_postal,
        codigoPostal: codigoPostal.codigo_postal || "",
        asentamiento: codigoPostal.asentamiento,
        idLocalidad: codigoPostal.id_localidad,
      };
    } catch (error) {
      console.error("Error al actualizar código postal:", error);
      throw new Error("Error al actualizar código postal");
    }
  }

  /**
   * Eliminar un código postal
   */
  async eliminar(id: number): Promise<boolean> {
    try {
      const codigoPostal = await CodigoPostalModel.findByPk(id);

      if (!codigoPostal) {
        return false;
      }

      await codigoPostal.destroy();
      return true;
    } catch (error) {
      console.error("Error al eliminar código postal:", error);
      throw new Error("Error al eliminar código postal");
    }
  }

  /**
   * Buscar códigos postales por código
   */
  async buscarPorCodigo(codigoPostal: string): Promise<CodigoPostal[]> {
    const filtros: FiltrosCodigoPostal = { codigoPostal };
    return await this.obtenerTodos(filtros);
  }

  /**
   * Obtener información geográfica completa por código postal
   * Devuelve código postal → localidad → municipio → entidad
   */
  async obtenerInformacionGeograficaCompleta(
    codigoPostal: string
  ): Promise<CodigoPostal[]> {
    try {
      console.log(
        `🔍 Obteniendo información geográfica completa para CP: ${codigoPostal}`
      );

      // 1. Buscar códigos postales que coincidan
      const codigosPostales = await CodigoPostalModel.findAll({
        where: {
          codigo_postal: codigoPostal,
        },
        attributes: [
          "id_codigo_postal",
          "codigo_postal",
          "asentamiento",
          "id_localidad",
        ],
        order: [["asentamiento", "ASC"]],
      });

      if (codigosPostales.length === 0) {
        return [];
      }

      // 2. Obtener información completa para cada código postal
      const informacionCompleta: CodigoPostal[] = [];

      for (const cp of codigosPostales) {
        const codigoPostalCompleto: CodigoPostal = {
          id: cp.id_codigo_postal,
          codigoPostal: cp.codigo_postal || "",
          asentamiento: cp.asentamiento,
          idLocalidad: cp.id_localidad,
        };

        // 3. Si tiene localidad, obtener información de localidad → municipio → entidad
        if (cp.id_localidad) {
          const localidad = await LocalidadModel.findByPk(cp.id_localidad, {
            attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
          });

          if (localidad) {
            codigoPostalCompleto.localidad = {
              id: localidad.id_localidad,
              nombre: localidad.localidad || "",
              ambito: localidad.ambito,
            };

            // 4. Si la localidad tiene municipio
            if (localidad.id_municipio) {
              const municipio = await MunicipioModel.findByPk(
                localidad.id_municipio,
                {
                  attributes: [
                    "id_municipio",
                    "nombre",
                    "cve_mun",
                    "id_entidad",
                  ],
                }
              );

              if (municipio) {
                codigoPostalCompleto.localidad.municipio = {
                  id: municipio.id_municipio,
                  nombre: municipio.nombre || "",
                  cveMun: municipio.cve_mun || "",
                };

                // 5. Si el municipio tiene entidad
                if (municipio.id_entidad) {
                  const entidad = await EntidadModel.findByPk(municipio.id_entidad, {
                    attributes: ["id_entidad", "nombre", "abreviatura"],
                  });

                  if (entidad) {
                    codigoPostalCompleto.localidad.municipio.entidad = {
                      id: entidad.id_entidad,
                      nombre: entidad.nombre || "",
                      abreviatura: entidad.abreviatura,
                    };
                  }
                }
              }
            }
          }
        }

        informacionCompleta.push(codigoPostalCompleto);
      }

      return informacionCompleta;
    } catch (error) {
      console.error("Error al obtener información geográfica completa:", error);
      throw new Error("Error al obtener información geográfica completa");
    }
  }

  // ==========================================
  // MÉTODOS LEGACY PARA COMPATIBILIDAD
  // ==========================================

  /**
   * Método legacy para compatibilidad con código existente
   * @deprecated Usar obtenerTodos() en su lugar
   */
  async obtenerCodigosPostales(): Promise<CodigoPostal[]> {
    return await this.obtenerTodos();
  }

  /**
   * Método legacy para compatibilidad con código existente
   * @deprecated Usar buscarPorCodigo() en su lugar
   */
  async buscarPorNombre(codigoPostal: string): Promise<CodigoPostal[]> {
    return await this.buscarPorCodigo(codigoPostal);
  }
}

export default new CtCodigoPostalService();


import { initModels } from "../models/init-models";
import { sequelize } from "../config/database";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const {
  ct_localidad: Localidad,
  ct_municipio: Municipio,
  ct_entidad: Entidad,
  ct_codigo_postal: CodigoPostal,
} = models;

class ctLocalidadService {
  //* Obtener todas las localidades
  async obtenerLocalidades() {
    try {
      const localidades = await Localidad.findAll({
        attributes: ["id_localidad", "localidad"],
      });
      if (localidades.length === 0) {
        throw new Error("No hay localidades");
      }
      return localidades;
    } catch (error) {
      console.error("Error al obtener localidades:", error);
      throw new Error("Error al obtener localidades");
    }
  }

  //* Obtener una localidad con municipio, entidad y códigos postales por ID
  async obtenerLocalidadesConMunicipio(id: number) {
    try {
      const localidad = await Localidad.findByPk(id, {
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: Municipio,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun", "id_entidad"],
            include: [
              {
                model: Entidad,
                as: "id_entidad_ct_entidad",
                attributes: ["id_entidad", "nombre", "abreviatura"],
              },
            ],
          },
        ],
      });

      if (!localidad) {
        throw new Error("No se encontró la localidad");
      }

      // Buscar códigos postales asociados a esta localidad
      const codigosPostales = await CodigoPostal.findAll({
        where: { id_localidad: id },
        attributes: ["id_codigo_postal", "codigo_postal", "asentamiento"],
      });

      // Agregar los códigos postales al resultado
      const resultado = {
        ...localidad.toJSON(),
        codigos_postales: codigosPostales,
      };

      return resultado;
    } catch (error) {
      console.error("Error al obtener localidad completa:", error);
      throw new Error("Error al obtener localidad completa");
    }
  }

  //* Obtener una localidad por su ID
  async obtenerLocalidadPorId(id: number) {
    try {
      const localidad = await Localidad.findByPk(id);
      if (!localidad) {
        throw new Error("No se encontró la localidad");
      }
      return localidad;
    } catch (error) {
      console.error("Error al obtener la localidad por ID:", error);
      throw new Error("Error al obtener la localidad por ID");
    }
  }

  //* Obtener una localidad por su ID con información del municipio
  async obtenerLocalidadConMunicipioPorId(id: number) {
    try {
      const localidad = await Localidad.findByPk(id, {
        attributes: ["id_localidad", "localidad", "ambito", "id_municipio"],
        include: [
          {
            model: Municipio,
            as: "id_municipio_ct_municipio",
            attributes: ["id_municipio", "nombre", "cve_mun"],
          },
        ],
      });

      if (!localidad) {
        throw new Error("No se encontró la localidad");
      }

      return localidad;
    } catch (error) {
      console.error(
        "Error al obtener la localidad con municipio por ID:",
        error
      );
      throw new Error("Error al obtener la localidad con municipio por ID");
    }
  }
}

export default new ctLocalidadService();

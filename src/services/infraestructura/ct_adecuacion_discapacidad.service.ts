import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_infraestructura_adecuacion_discapacidad: AdecuacionDiscapacidad } =
  models;

export class CtAdecuacionDiscapacidadService {
  //* Obtener todos las adecuaciones de discapacidad
  async obtenerAdecuacionDiscapacidad() {
    try {
      const adecuacionDiscapacidad = await AdecuacionDiscapacidad.findAll({
        attributes: ["id_adecuacion", "descripcion"],
      });
      if (adecuacionDiscapacidad.length === 0) {
        throw new Error("No hay adecuaciones de discapacidad");
      }
      return adecuacionDiscapacidad;
    } catch (error) {
      console.error("Error al obtener adecuaciones de discapacidad:", error);
      throw new Error("Error al obtener adecuaciones de discapacidad");
    }
  }
}

export default new CtAdecuacionDiscapacidadService();

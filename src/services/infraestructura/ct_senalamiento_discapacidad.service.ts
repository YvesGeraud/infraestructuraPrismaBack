import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const {
  ct_infraestructura_senalamiento_discapacidad: SenalamientoDiscapacidad,
} = models;

export class CtSenalamientoDiscapacidadService {
  //* Obtener todos los senalamientos de discapacidad
  async obtenerSenalamientoDiscapacidad() {
    try {
      const senalamientoDiscapacidad = await SenalamientoDiscapacidad.findAll({
        attributes: ["id_senalamiento", "descripcion"],
      });
      if (senalamientoDiscapacidad.length === 0) {
        throw new Error("No hay senalamientos de discapacidad");
      }
      return senalamientoDiscapacidad;
    } catch (error) {
      console.error("Error al obtener senalamientos de discapacidad:", error);
      throw new Error("Error al obtener senalamientos de discapacidad");
    }
  }
}

export default new CtSenalamientoDiscapacidadService();

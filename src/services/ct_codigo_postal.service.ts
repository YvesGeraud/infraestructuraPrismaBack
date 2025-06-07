import { initModels } from "../models/init-models";
import { sequelize } from "../config/database";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_codigo_postal: CodigoPostal } = models;

class ctCodigoPostalService {
  //* Obtener todos los códigos postales
  async obtenerCodigosPostales() {
    try {
      const codigosPostales = await CodigoPostal.findAll({
        attributes: ["id_codigo_postal", "codigo_postal"],
      });
      if (codigosPostales.length === 0) {
        throw new Error("No hay códigos postales");
      }
      return codigosPostales;
    } catch (error) {
      console.error("Error al obtener códigos postales:", error);
      throw new Error("Error al obtener códigos postales");
    }
  }
}

export default new ctCodigoPostalService();

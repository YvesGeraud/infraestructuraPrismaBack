import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario: Inventario } = models;

export class CtInventarioService {
  //* Obtener todos las adecuaciones de discapacidad
  async obtenerInventario() {
    try {
      const inventario = await Inventario.findAll({
        attributes: [
          "id_inventario",
          "folio",
          "no_serie",
          "estatus",
          "observaciones",
          "modelo",
        ],
        limit: 10,
      });
      if (inventario.length === 0) {
        throw new Error("No hay adecuaciones de discapacidad");
      }
      return inventario;
    } catch (error) {
      console.error("Error al obtener inventario:", error);
      throw new Error("Error al obtener inventario");
    }
  }
}

export default new CtInventarioService();

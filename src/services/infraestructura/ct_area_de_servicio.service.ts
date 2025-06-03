import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_infraestructura_area_de_servicio: AreaDeServicio } = models;

export class CtAreaDeServicioService {
  //* Obtener todos los almacenamientos de agua
  async obtenerAreaDeServicio() {
    try {
      const areaDeServicio = await AreaDeServicio.findAll({
        attributes: ["id_servicio", "descripcion"],
      });
      if (areaDeServicio.length === 0) {
        throw new Error("No hay almacenamientos de agua");
      }
      return areaDeServicio;
    } catch (error) {
      console.error("Error al obtener área de servicio:", error);
      throw new Error("Error al obtener área de servicio");
    }
  }
}

export default new CtAreaDeServicioService();

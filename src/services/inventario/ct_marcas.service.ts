import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_marcas: Marca } = models;

class CtMarcaService{
    //* Obtener todas las marcas
    async obtenerMarcas(){
        try{
            const marcas = await Marca.findAll({
                attributes: ["id_marca","nombre_marca"],
            });
            if(marcas.length === 0){
                throw new Error("No hay marcas");
            }
            return marcas;
        }catch(error){
            console.error("Error al obtener marcas:", error);
            throw new Error("Error al obtener marcas");
        }
    }

}
export default new CtMarcaService();
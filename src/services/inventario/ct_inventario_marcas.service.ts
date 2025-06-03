import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_marcas: InventarioMarcas } = models;

class ctInventarioMarcaService{
    //* Obtener todas las marcas
    async obtenerMarcas(){
        try{
            const marcas = await InventarioMarcas.findAll({
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
export default new ctInventarioMarcaService();
import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_color: InventarioColor } = models;

class ctInventarioColorService{
    //* Obtener todos los colores
    async obtenerColores(){
        try{
            const colores = await InventarioColor.findAll({
                attributes: ["id_color","nombre_color"],
            });
            if(colores.length === 0){
                throw new Error("No hay colores");
            }
            return colores;
        }catch(error){
            console.error("Error al obtener colores:", error);
            throw new Error("Error al obtener colores");
        }
    }
}

export default new ctInventarioColorService();
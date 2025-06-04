import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models= initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_material:Material} = models;

class CtMaterialService{
    //* Obtener todos los materiales
    async obtenerMateriales(){
        try{
            const materiales = await Material.findAll({
                attributes: ["id_material","nombre_material"],
        });
        if(materiales.length === 0){
            throw new Error("No hay materiales");
        }
        return materiales;
    }catch(error){
        console.error("Error al obtener los materiales:", error);
        throw new Error("Error al obtener los materiales");
    }
}
}

export default new CtMaterialService();

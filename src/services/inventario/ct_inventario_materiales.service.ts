import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { ct_inventario_material } from '../../models/ct_inventario_material';

//! Inicializar los modelos
const models= initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_material:InventarioMaterial} = models;

class ctInventarioMaterialService{
    //* Obtener todos los materiales
    async obtenerMateriales(){
        try{
            const materiales = await InventarioMaterial.findAll({
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

export default new ctInventarioMaterialService();

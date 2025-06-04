import { initModels } from "../../models";
import { sequelize } from "../../models";

//!Inicializar los modelos 
const models= initModels(sequelize);

//! Desestructurar el modelo que necesitamos 
const {ct_inventario_subclases: Subclase}=models;

class CtInventarioSubclaseService{
    //*Obtener todas las subclases
    async obtenerTodasLasSubclases(){
        try{
            const subclases=await Subclase.findAll({
                attributes:["id_subclase", "descripcion"],
            });
            if(subclases.length===0){
                throw new Error("No se encontraron subclases");
            }
            return subclases;
        }catch(error){
            console.error("Error al obtener las subclases:", error);
            throw new Error("Error al obtener las subclases");
        }
    }
    //* Obtener la subclase por su id 
async obtenerSubclasePorId(id: number){
    try{
        const subclase=await Subclase.findByPk(id);
        if(!subclase){
            throw new Error("No se encontró la subclase");
        }
        return subclase;
    }catch(error){
        console.error("Error al obtener la subclase por id:", error);
        throw new Error("Error al obtener la subclase por id");
    }
}
}



export default new CtInventarioSubclaseService();
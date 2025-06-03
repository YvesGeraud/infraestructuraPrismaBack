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
}

export default new CtInventarioSubclaseService();
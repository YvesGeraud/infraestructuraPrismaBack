import { initModels } from "../../models";
import { sequelize } from "../../models";
import { Op } from "sequelize";

//!Inicializar los modelos 
const models= initModels(sequelize);

//! Desestructurar el modelo que necesitamos 
const {ct_inventario_clases: Clase}=models;


class CtClaseService{
    //*Obtener todas las clases
    async obtenerTodasLasClases(){
        try{
            const clases=await Clase.findAll({
                attributes:["id_clase", "descripcion"],
            });
            if(clases.length===0){
                throw new Error("No se encontraron clases");
        }
        return clases;
        }catch(error){
            console.error("Error al obtener las clases:", error);
            throw error;
        }
    }
}

export default new CtClaseService();
import { initModels } from "../../models";
import { sequelize } from "../../models";
import { ct_inventario_clases } from '../../models/ct_inventario_clases';

//!Inicializar los modelos 
const models= initModels(sequelize);

//! Desestructurar el modelo que necesitamos 
const {ct_inventario_clases: Clase}=models;


class CtInventarioClaseService{
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

export default new CtInventarioClaseService();
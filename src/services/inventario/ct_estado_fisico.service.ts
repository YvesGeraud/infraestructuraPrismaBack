import { initModels } from "../../models";
import { sequelize } from "../../models";
import { Op } from "sequelize";


//! Inicializa los modelos 
const models=initModels(sequelize);

//! Desestructurar los modelos que necesitamos 
const {ct_inventario_estado_fisico: EstadoFisico}=models;

class CtEstadoFisicoService{
    //* obtener los estados fisicos 
    async obtenerEstadosFisicos(){
        try{
            const estadoFisico=await EstadoFisico.findAll({
                attributes:["id_estadoFisico", "descripcion"],
            });
            if(estadoFisico.length === 0){
                throw new Error("No se encontraron ningun estado fisico")
            }
            return estadoFisico;
        }catch(error){
            console.error("Error al obtener los estados fisicos ", error)
            throw new  Error("Error al obtener los estados fisicos ")
        }
    }
}
export default new CtEstadoFisicoService();
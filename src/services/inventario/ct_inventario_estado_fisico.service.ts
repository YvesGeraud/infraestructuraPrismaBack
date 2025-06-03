import { initModels } from "../../models";
import { sequelize } from "../../models";
import { ct_inventario_estado_fisico } from '../../models/ct_inventario_estado_fisico';


//! Inicializa los modelos 
const models=initModels(sequelize);

//! Desestructurar los modelos que necesitamos 
const {ct_inventario_estado_fisico: InventarioEstadoFisico}=models;

class CtInventarioEstadoFisicoService{
    //* obtener los estados fisicos 
    async obtenerEstadosFisicos(){
        try{
            const estadoFisico=await InventarioEstadoFisico.findAll({
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
export default new CtInventarioEstadoFisicoService();
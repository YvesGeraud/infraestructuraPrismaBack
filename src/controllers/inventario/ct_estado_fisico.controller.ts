import { Request, Response } from "express";
import CtEstadoFisicoService from "../../services/inventario/ct_estado_fisico.service";

 class ctEstadoFisicoController{
    //* Obtener los estados fisicos 
    async obtenerEstadoFisico(req: Request, res: Response){
        try{
            const estadoFisico= await CtEstadoFisicoService.obtenerEstadosFisicos();
            res.status(200).json(estadoFisico);
        }catch(error){
            res.status(500).json({message: "Error al obtner los estados fisicos controller 1", error:error});
            console.error("Error al obtener los estados fisicos controller 2:", error); 
        }
    }
}
export default new ctEstadoFisicoController(); 

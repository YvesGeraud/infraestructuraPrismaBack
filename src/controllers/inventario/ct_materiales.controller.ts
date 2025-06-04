import { Request, Response  } from "express";
import  CtMaterialService from "../../services/inventario/ct_materiales.service";

class CtMaterialController {
    //* Obtener todos los materiales
    async obtenerMateriales(req: Request, res: Response){
        try{
            const materiales = await CtMaterialService.obtenerMateriales();
            res.status(200).json(materiales);
        }catch(error){
            res.status(500).json({message: "Error al obtener los materiales controller 1", error: error});
            console.error("Error al obtener los materiales controller: 2", error)
        }
        
    }
}
export default new CtMaterialController();




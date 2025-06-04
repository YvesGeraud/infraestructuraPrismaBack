import { Request, Response  } from "express";
import  ctInventarioProveedorService from "../../services/inventario/ct_inventario_materiales.service";

class ctInventarioMaterialController {
    //* Obtener todos los materiales
    async obtenerMateriales(req: Request, res: Response){
        try{
            const materiales = await ctInventarioProveedorService.obtenerMateriales();
            res.status(200).json(materiales);
        }catch(error){
            res.status(500).json({message: "Error al obtener los materiales controller 1", error: error});
            console.error("Error al obtener los materiales controller: 2", error)
        }
        
    }
}
export default new ctInventarioMaterialController();




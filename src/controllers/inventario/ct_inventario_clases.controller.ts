import { Request, Response } from "express";
import CtInventarioClaseService from "../../services/inventario/ct_inventario_clase.service";

//!Obtener todas las clases
class CtInventarioClaseController{
    async obtenerTodasLasClases(req: Request, res: Response){
        try{
            const clases=await CtInventarioClaseService.obtenerTodasLasClases();
            res.status(200).json(clases);
        }catch(error){
            res.status(500).json({message: "Error al obtener las clases controller 1", error: error});
            console.error("Error al obtener las clases controller 2:", error);
        }
    }
}

export default new CtInventarioClaseController();
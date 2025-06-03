import { Request, Response } from "express";
import CtInventarioSubclaseService from "../../services/inventario/ct_inventario_subclase.service";

export class CtInventarioSubClaseController{
    //* Obtener las subclases
    async obtenerSubclases(req: Request, res: Response){
        try{
            const subclases=await CtInventarioSubclaseService.obtenerTodasLasSubclases();
            res.status(200).json(subclases);
        }catch(error){
            res.status(500).json({message: "Error al obtener las subclases controller 1", error: error});
            console.error("Error al obtener las subclases controller 2:", error);
        }
    }
}

export default new CtInventarioSubClaseController();
import { Request, Response } from "express";
import CtInventarioSubclaseService from "../../services/inventario/ct_inventario_subclase.service";

 class CtInventarioSubClaseController{
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
 //* Obtener la subclase por su id 
 async obtenerSubclasePorId(req:Request, res:Response){
    const subclaseId= await CtInventarioSubclaseService.obtenerSubclasePorId(
        parseInt(req.params.id));
    res.status(200).json(subclaseId);
 }

}

export default new CtInventarioSubClaseController();
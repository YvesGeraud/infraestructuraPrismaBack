import { Request, Response } from "express";
import CtSubClaseService from "../../services/inventario/ct_subclase.service";

 class CtSubClaseController{
    //* Obtener las subclases
    async obtenerSubclases(req: Request, res: Response){
        try{
            const subclases=await CtSubClaseService.obtenerTodasLasSubclases();
            res.status(200).json(subclases);
        }catch(error){
            res.status(500).json({message: "Error al obtener las subclases controller 1", error: error});
            console.error("Error al obtener las subclases controller 2:", error);
        }
    }
 //* Obtener la subclase por su id 
 async obtenerSubclasePorId(req:Request, res:Response){
    const subclaseId= await CtSubClaseService.obtenerSubclasePorId(
        parseInt(req.params.id));
    res.status(200).json(subclaseId);
 }

}

export default new CtSubClaseController();
import { Request, Response } from "express";
import CtColorService from "../../services/inventario/ct_color.service";

export class CtColorController{
    //* Obtener todos los colores
    async obtenerColores(req: Request, res: Response  ){
        try{
            const colores = await CtColorService.obtenerColores();
            res.status(200).json(colores);
        }catch(error){
            res.status(500).json({message: "Error al obtener los colores controller 1", error: error});
            console.error("Error al obtener los colores controller controller 2:", error);
        }
    }
}
export default new CtColorController();
import { Request, Response } from "express";
import ctInventarioColorService from "../../services/inventario/ct_inventario_color.service";

export class ctInventarioColorController{
    //* Obtener todos los colores
    async obtenerColores(req: Request, res: Response  ){
        try{
            const colores = await ctInventarioColorService.obtenerColores();
            res.status(200).json(colores);
        }catch(error){
            res.status(500).json({message: "Error al obtener los colores controller 1", error: error});
            console.error("Error al obtener los colores controller controller 2:", error);
        }
    }
}
export default new ctInventarioColorController();
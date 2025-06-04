import { Request, Response } from "express";
import CtMarcaService from "../../services/inventario/ct_marcas.service";

 class CtMarcaController{
    //* Obtener todas las marcas
    async obtenerMarcas(req: Request, res: Response){
        try{
            const marcas = await CtMarcaService.obtenerMarcas();
            res.status(200).json(marcas);
        }catch(error){
            res.status(500).json({message: "Error al obtener las marcas controller 1", error: error});
            console.error("Error al obtener las marcas controller 2:", error);
        }
    }
}

export default new CtMarcaController();

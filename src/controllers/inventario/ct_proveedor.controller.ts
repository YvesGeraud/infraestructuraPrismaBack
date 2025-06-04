import { Request, Response } from "express";
import CtProveedorService from "../../services/inventario/ct_proveedor.service";

 class CtProveedorController{
    //* Obtener todos los proveedores
    async obtenerProveedores(req: Request, res: Response){
        try{
            const proveedores = await CtProveedorService.obtenerProveedores();
            res.status(200).json(proveedores);
        }catch(error){
            res.status(500).json({message: "Error al obtener los proveedores controller 1", error: error});
            console.error("Error al obtener los proveedores controller 2:", error);
        }
    }
}
export default new CtProveedorController();
import { Request, Response } from "express";
import ctInventarioProveedorService from "../../services/inventario/ct_inventario_proveedor.service";

 class ctInventarioProveedorController{
    //* Obtener todos los proveedores
    async obtenerProveedores(req: Request, res: Response){
        try{
            const proveedores = await ctInventarioProveedorService.obtenerProveedores();
            res.status(200).json(proveedores);
        }catch(error){
            res.status(500).json({message: "Error al obtener los proveedores controller 1", error: error});
            console.error("Error al obtener los proveedores controller 2:", error);
        }
    }
}
export default new ctInventarioProveedorController();
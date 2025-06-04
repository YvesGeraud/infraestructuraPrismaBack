import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";
import { Op } from "sequelize";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_proveedor: Proveedor } = models;

class CtProveedorService{
    //* Obtener todos los proveedores
    async obtenerProveedores(){
        try{
            const proveedores = await Proveedor.findAll({
                attributes: ["id_proveedor","nombre_proveedor"],
            });
            if(proveedores.length === 0){
                throw new Error("No hay proveedores");
        }
             return proveedores;
        }catch(error){
            console.error("Error al obtener proveedores:", error);
            throw new Error("Error al obtener proveedores");
        }
    }
}

export default new CtProveedorService();
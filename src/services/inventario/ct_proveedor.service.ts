import { initModels } from "../../models/init-models";
import { sequelize } from "../../config/database";

//! Inicializar los modelos
const models = initModels(sequelize);

//! Desestructurar los modelos que necesitamos
const { ct_inventario_proveedor: InventarioProveedor } = models;

class ctInventarioProveedorService{
    //* Obtener todos los proveedores
    async obtenerProveedores(){
        try{
            const proveedores = await InventarioProveedor.findAll({
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

export default new ctInventarioProveedorService();
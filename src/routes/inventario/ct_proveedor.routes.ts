import { Router } from "express";
import ctInventarioProveedorController from "../../controllers/inventario/ct_inventario_proveedor.controller";

const router = Router();
//* Obtener todos los proveedores
router.get("/", ctInventarioProveedorController.obtenerProveedores);

export default router;
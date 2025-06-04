import { Router } from "express";
import ctProveedorController from "../../controllers/inventario/ct_proveedor.controller";

const router = Router();
//* Obtener todos los proveedores
router.get("/", ctProveedorController.obtenerProveedores);

export default router;
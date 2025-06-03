import { Router } from "express";
import ctInventarioMaterialController from "../../controllers/inventario/ct_inventario_materiales.controller";

const router= Router();
//*Obtener todos los materiales
router.get("/", ctInventarioMaterialController.obtenerMateriales);

export default router; 
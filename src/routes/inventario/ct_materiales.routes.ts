import { Router } from "express";
import ctMaterialController from "../../controllers/inventario/ct_materiales.controller";

const router= Router();
//*Obtener todos los materiales
router.get("/", ctMaterialController.obtenerMateriales);

export default router; 
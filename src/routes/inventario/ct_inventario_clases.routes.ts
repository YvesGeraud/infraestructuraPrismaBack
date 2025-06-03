import { Router } from "express";
import CtInventarioClaseController from "../../controllers/inventario/ct_inventario_clases.controller";

const router=Router();

//*Obtener todas las clases
router.get("/", CtInventarioClaseController.obtenerTodasLasClases);

export default router;
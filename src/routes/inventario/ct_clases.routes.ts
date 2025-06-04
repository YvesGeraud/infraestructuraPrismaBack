import { Router } from "express";
import CtClaseController from "../../controllers/inventario/ct_clases.controller";

const router=Router();

//*Obtener todas las clases
router.get("/", CtClaseController.obtenerTodasLasClases);

export default router;
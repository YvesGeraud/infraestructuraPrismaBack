import { Router } from "express";
import CtEstadoFisicoController from "../../controllers/inventario/ct_estado_fisico.controller";

const router=Router();

//*Obtener todos los estados físicos
router.get("/", CtEstadoFisicoController.obtenerEstadoFisico);

export default router; 
import { Router } from "express";
import ctInventarioEstadoFisicoController from "../../controllers/inventario/ct_inventario_estado_fisico.controller";

const router=Router();

router.get("/", ctInventarioEstadoFisicoController.obtenerEstadoFisico);

export default router; 
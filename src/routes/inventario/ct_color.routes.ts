import { Router } from "express";
import ctInventarioColorController from "../../controllers/inventario/ct_inventario_color.controller";

const router = Router();
//* Obtener todos los colores
router.get("/", ctInventarioColorController.obtenerColores);

export default router;
import { Router } from "express";
import CtColorController from "../../controllers/inventario/ct_color.controller";

const router = Router();
//* Obtener todos los colores
router.get("/", CtColorController.obtenerColores);

export default router;
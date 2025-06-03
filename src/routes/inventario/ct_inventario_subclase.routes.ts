import { Router } from "express";
import CtInventarioSubClaseController from "../../controllers/inventario/ct_inventario_subclase.controller";

const router= Router();

//* Obtener las subclases
router.get("/", CtInventarioSubClaseController.obtenerSubclases);

export default router;
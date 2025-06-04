import { Router } from "express";
import CtInventarioSubClaseController from "../../controllers/inventario/ct_inventario_subclase.controller";

const router= Router();

//* Obtener las subclases
router.get("/", CtInventarioSubClaseController.obtenerSubclases);

//* Obtener la subclase por su id
router.get("/:id", CtInventarioSubClaseController.obtenerSubclasePorId);
export default router;
import { Router } from "express";
import CtSubClaseController from "../../controllers/inventario/ct_subclase.controller";

const router= Router();

//* Obtener las subclases
router.get("/", CtSubClaseController.obtenerSubclases);

//* Obtener la subclase por su id
router.get("/:id", CtSubClaseController.obtenerSubclasePorId);
export default router;
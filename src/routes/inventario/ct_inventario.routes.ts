import { Router } from "express";
import CtInventarioController from "../../controllers/inventario/ct_inventario.controller";

const router = Router();

//*Obtener todos los inventarios
router.get("/", CtInventarioController.obtenerInventario);

export default router;

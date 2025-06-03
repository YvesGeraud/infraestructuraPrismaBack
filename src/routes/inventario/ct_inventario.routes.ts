import { Router } from "express";
import CtInventarioController from "../../controllers/inventario/ct_inventario.controller";

const router = Router();

router.get("/", CtInventarioController.obtenerInventario);

export default router;

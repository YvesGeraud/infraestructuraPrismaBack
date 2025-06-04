import { Router } from "express";
import ctInventarioMarcaController from "../../controllers/inventario/ct_inventario_marcas.controller";

const router = Router();
//* Obtener todos las marcas
router.get("/", ctInventarioMarcaController.obtenerMarcas);

export default router;

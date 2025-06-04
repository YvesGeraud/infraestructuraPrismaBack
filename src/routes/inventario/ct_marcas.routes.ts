import { Router } from "express";
import ctMarcaController from "../../controllers/inventario/ct_marcas.controller";

const router = Router();
//* Obtener todos las marcas
router.get("/", ctMarcaController.obtenerMarcas);

export default router;

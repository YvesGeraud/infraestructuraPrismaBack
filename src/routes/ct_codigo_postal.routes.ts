import { Router } from "express";
import ctCodigoPostalController from "../controllers/ct_codigo_postal.controller";

const router = Router();

//* Obtener todos los códigos postales
router.get("/", ctCodigoPostalController.obtenerCodigosPostales);

export default router;

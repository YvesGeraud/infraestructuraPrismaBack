import { Router } from "express";
import CtAreaDeServicioController from "../../controllers/infraestructura/ct_area_de_servicio.controller";

const router = Router();

router.get("/", CtAreaDeServicioController.obtenerAreaDeServicio);

export default router;

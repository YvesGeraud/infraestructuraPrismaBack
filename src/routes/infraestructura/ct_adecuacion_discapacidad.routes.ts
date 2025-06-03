import { Router } from "express";
import CtAdecuacionDiscapacidadController from "../../controllers/infraestructura/ct_adecuacion_discapacidad.controller";

const router = Router();

router.get(
  "/",
  CtAdecuacionDiscapacidadController.obtenerAdecuacionDiscapacidad
);

export default router;

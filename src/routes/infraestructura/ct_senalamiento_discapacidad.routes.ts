import { Router } from "express";
import CtSenalamientoDiscapacidadController from "../../controllers/infraestructura/ct_senalamiento_discapacidad.controller";

const router = Router();

router.get(
  "/",
  CtSenalamientoDiscapacidadController.obtenerSenalamientoDiscapacidad
);

export default router;

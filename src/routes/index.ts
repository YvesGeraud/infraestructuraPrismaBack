import { Router } from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import poolRoutes from "./poolRoutes";
import authRoutes from "./authRoutes";
import archivoRoutes from "./archivoRoutes";
import emailRoutes from "./emailRoutes";
import reportesRoutes from "./reportesRoutes";
import orderRoutes from "./orderRoutes";
import { diagnosticoRoutes } from "./diagnosticoRoutes";
import dtEscuelaAlumnoRoutes from "./dt_escuela_alumno.routes";
import rlEscuelaAlumnoGradoRoutes from "./rl_escuela_alumno_grado.routes";

const router = Router();

// Montar las rutas con sus prefijos
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/pool", poolRoutes);
router.use("/archivos", archivoRoutes);
router.use("/emails", emailRoutes);
router.use("/reportes", reportesRoutes);
router.use("/orders", orderRoutes);
router.use("/diagnostico", diagnosticoRoutes);
router.use("/dt_escuela_alumno", dtEscuelaAlumnoRoutes);
router.use("/rl_escuela_alumno_grado", rlEscuelaAlumnoGradoRoutes);
// Ruta de salud para las APIs
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

export default router;

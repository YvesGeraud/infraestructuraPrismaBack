import { Router, Request, Response } from "express";
import { getPoolStats, getPoolHealth } from "../config/database";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// Endpoint para verificar el estado del pool de conexiones
router.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    const health = await getPoolHealth();

    res.status(health.healthy ? 200 : 503).json({
      success: health.healthy,
      message: health.healthy
        ? "Pool de conexiones saludable"
        : "Pool de conexiones con problemas",
      data: health,
    });
  })
);

// Endpoint para obtener estadísticas detalladas del pool
router.get(
  "/stats",
  asyncHandler(async (req: Request, res: Response) => {
    const stats = await getPoolStats();

    res.json({
      success: true,
      message: "Estadísticas del pool de conexiones",
      data: stats,
    });
  })
);

// Endpoint para obtener métricas en tiempo real
router.get(
  "/metrics",
  asyncHandler(async (req: Request, res: Response) => {
    const { poolMonitor } = await import("../config/database");
    const metrics = await poolMonitor.getMetrics();

    res.json({
      success: true,
      message: "Métricas en tiempo real del pool",
      data: metrics,
    });
  })
);

export default router;

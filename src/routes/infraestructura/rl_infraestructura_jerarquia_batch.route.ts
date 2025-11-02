import { Router } from "express";
import rlInfraestructuraJerarquiaBatchController from "../../controllers/infraestructura/rl_infraestructura_jerarquia_batch.controller";
import { verificarAutenticacion } from "../../middleware/authMiddleware";

/**
 * 🎯 RUTAS PARA BATCH DE JERARQUÍA DE INFRAESTRUCTURA
 *
 * Todas las rutas requieren autenticación JWT
 */

const router = Router();

/**
 * 🚀 POST /api/infraestructura/jerarquia/batch
 * Crear batch de relaciones jerárquicas de infraestructura
 *
 * @requires Authentication JWT
 * @body application/json
 *   {
 *     "observaciones": "Carga inicial",
 *     "jerarquias": [
 *       {
 *         "id_instancia": 1,
 *         "id_ct_infraestructura_tipo_instancia": 1,
 *         "id_dependencia": null
 *       }
 *     ]
 *   }
 *
 * @returns {201} Jerarquías creadas exitosamente
 * @returns {400} Errores de validación
 * @returns {401} No autenticado
 * @returns {404} Tipo de instancia o dependencia no encontrada
 * @returns {500} Error del servidor
 */
router.post(
  "/",
  verificarAutenticacion,
  rlInfraestructuraJerarquiaBatchController.crearBatch.bind(
    rlInfraestructuraJerarquiaBatchController
  )
);

export default router;

/*
🎉 RUTAS DE BATCH DE JERARQUÍA DE INFRAESTRUCTURA

✅ Características:
- 🔐 Todas las rutas requieren autenticación
- 📝 Validación completa con Zod
- 🔄 Transacciones atómicas
- 🛡️ Validación de tipos de instancia y dependencias

🔧 Endpoints disponibles:
- POST   / - Crear batch de jerarquías

📄 Ejemplo de request:
POST /api/infraestructura/jerarquia/batch
Content-Type: application/json

{
  "observaciones": "Carga inicial de estructura organizacional",
  "jerarquias": [
    {
      "id_instancia": 1,
      "id_ct_infraestructura_tipo_instancia": 1,
      "id_dependencia": null
    },
    {
      "id_instancia": 5,
      "id_ct_infraestructura_tipo_instancia": 2,
      "id_dependencia": null
    }
  ]
}

📄 Ejemplo de response:
{
  "exito": true,
  "mensaje": "Se crearon 2 relaciones jerárquicas exitosamente",
  "datos": {
    "jerarquias": [...],
    "total": 2,
    "observaciones": "Carga inicial..."
  }
}
*/

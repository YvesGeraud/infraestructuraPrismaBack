import { prisma, poolMonitor, getPoolStats } from "../src/config/database";

// Script para probar la configuración del pool de conexiones
async function testPoolConfiguration() {
  console.log("🧪 Iniciando pruebas del pool de conexiones...\n");

  try {
    // 1. Verificar conexión básica
    console.log("1️⃣ Verificando conexión básica...");
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1 as test`;
    const connectionTime = Date.now() - start;
    console.log(`   ✅ Conexión exitosa en ${connectionTime}ms\n`);

    // 2. Obtener estadísticas del pool
    console.log("2️⃣ Obteniendo estadísticas del pool...");
    const stats = await getPoolStats();
    console.log("   📊 Configuración del pool:");
    console.log(`   - Conexiones máximas: ${stats.config.connectionLimit}`);
    console.log(`   - Timeout del pool: ${stats.config.poolTimeout}s`);
    console.log(`   - Timeout de conexión: ${stats.config.connectTimeout}s`);
    console.log(`   - Entorno: ${process.env.NODE_ENV || "development"}`);
    console.log();

    // 3. Verificar salud del pool
    console.log("3️⃣ Verificando salud del pool...");
    const health = await poolMonitor.healthCheck();
    console.log(
      `   🏥 Estado: ${health.healthy ? "✅ Saludable" : "❌ Con problemas"}`
    );
    console.log(`   ⏱️  Tiempo de respuesta: ${health.responseTime}ms`);
    console.log(`   📈 Tamaño del pool: ${health.poolSize} conexiones`);
    console.log();

    // 4. Prueba de carga básica
    console.log("4️⃣ Ejecutando prueba de carga básica...");
    const queries = Array.from(
      { length: 10 },
      (_, i) =>
        prisma.$queryRaw`SELECT ${i} as query_number, NOW() as timestamp`
    );

    const loadTestStart = Date.now();
    await Promise.all(queries);
    const loadTestTime = Date.now() - loadTestStart;
    console.log(`   🚀 10 queries paralelas completadas en ${loadTestTime}ms`);
    console.log(
      `   📈 Promedio por query: ${(loadTestTime / 10).toFixed(2)}ms\n`
    );

    // 5. Obtener métricas finales
    console.log("5️⃣ Métricas finales del pool...");
    const finalMetrics = await poolMonitor.getMetrics();
    console.log("   📋 Métricas actuales:");
    console.log(`   - Conexiones activas: ${finalMetrics.activeConnections}`);
    console.log(`   - Conexiones inactivas: ${finalMetrics.idleConnections}`);
    console.log(`   - Total de conexiones: ${finalMetrics.totalConnections}`);
    console.log(`   - Solicitudes en espera: ${finalMetrics.waitingRequests}`);
    console.log();

    // 6. Recomendaciones
    console.log("6️⃣ Recomendaciones:");
    stats.recommendations.forEach((rec, index) => {
      console.log(`   💡 ${index + 1}. ${rec}`);
    });

    console.log("\n🎉 Todas las pruebas del pool completadas exitosamente!");

    return {
      success: true,
      connectionTime,
      loadTestTime,
      health,
      stats,
      metrics: finalMetrics,
    };
  } catch (error) {
    console.error("❌ Error durante las pruebas del pool:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// Función para probar diferentes cargas
async function testPoolUnderLoad(concurrentConnections = 20) {
  console.log(
    `\n🔥 Probando pool bajo carga (${concurrentConnections} conexiones concurrentes)...\n`
  );

  try {
    const queries = Array.from(
      { length: concurrentConnections },
      (_, i) =>
        prisma.$queryRaw`SELECT ${i} as query_id, SLEEP(0.1) as delay, NOW() as timestamp`
    );

    const start = Date.now();
    await Promise.all(queries);
    const duration = Date.now() - start;

    console.log(
      `✅ ${concurrentConnections} queries concurrentes completadas en ${duration}ms`
    );
    console.log(
      `📊 Promedio por query: ${(duration / concurrentConnections).toFixed(
        2
      )}ms`
    );

    // Verificar estado del pool después de la carga
    const healthAfterLoad = await poolMonitor.healthCheck();
    console.log(
      `🏥 Estado del pool después de la carga: ${
        healthAfterLoad.healthy ? "✅ Saludable" : "❌ Estresado"
      }`
    );

    return {
      success: true,
      duration,
      averageTime: duration / concurrentConnections,
      healthAfterLoad,
    };
  } catch (error) {
    console.error("❌ Error durante la prueba de carga:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

// Ejecutar las pruebas si se ejecuta directamente
if (require.main === module) {
  async function runTests() {
    const basicTest = await testPoolConfiguration();

    if (basicTest.success) {
      const loadTest = await testPoolUnderLoad(10);

      console.log("\n📈 RESUMEN DE PRUEBAS:");
      console.log("=".repeat(50));
      console.log(
        `✅ Pruebas básicas: ${basicTest.success ? "EXITOSAS" : "FALLIDAS"}`
      );
      console.log(
        `✅ Pruebas de carga: ${loadTest.success ? "EXITOSAS" : "FALLIDAS"}`
      );
      console.log(`⏱️  Tiempo de conexión: ${basicTest.connectionTime}ms`);
      console.log(
        `🚀 Tiempo de carga: ${
          loadTest.success ? loadTest.duration + "ms" : "N/A"
        }`
      );
      console.log("=".repeat(50));
    }

    await prisma.$disconnect();
    process.exit(
      basicTest.success && (await testPoolUnderLoad(10)).success ? 0 : 1
    );
  }

  runTests().catch(console.error);
}

export { testPoolConfiguration, testPoolUnderLoad };

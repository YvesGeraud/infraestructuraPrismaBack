import os from "os";
import fs from "fs";
import path from "path";
import { fileConfig } from "../config/env";

export interface DiagnosticoSistema {
  usuario: {
    uid?: number;
    gid?: number;
    nombreUsuario: string;
    directorioInicio: string;
  };
  proceso: {
    pid: number;
    plataforma: string;
    version: string;
    arquitectura: string;
    memoriaUsada: number;
    directorioTrabajo: string;
  };
  permisos: {
    directorioUploads: boolean;
    puedeEscribirLogs: boolean;
    puedeCrearArchivos: boolean;
  };
  errores: string[];
}

/**
 * Realiza un diagnóstico completo del sistema y permisos
 */
export const realizarDiagnosticoSistema = (): DiagnosticoSistema => {
  const errores: string[] = [];

  // Información del usuario (solo en sistemas Unix)
  let uid: number | undefined;
  let gid: number | undefined;

  try {
    // process.getuid() solo existe en sistemas Unix/Linux/macOS
    if (typeof process.getuid === "function") {
      uid = process.getuid();
      gid = process.getgid?.();
    }
  } catch (error) {
    errores.push(`Error obteniendo UID: ${error}`);
  }

  // Información del proceso
  const memoriaUsada = process.memoryUsage();

  // Verificar permisos
  const permisos = verificarPermisos();

  return {
    usuario: {
      uid,
      gid,
      nombreUsuario: os.userInfo().username,
      directorioInicio: os.homedir(),
    },
    proceso: {
      pid: process.pid,
      plataforma: process.platform,
      version: process.version,
      arquitectura: process.arch,
      memoriaUsada: Math.round(memoriaUsada.rss / 1024 / 1024), // MB
      directorioTrabajo: process.cwd(),
    },
    permisos,
    errores,
  };
};

/**
 * Verifica permisos críticos del sistema
 */
const verificarPermisos = () => {
  const permisos = {
    directorioUploads: false,
    puedeEscribirLogs: false,
    puedeCrearArchivos: false,
  };

  try {
    // Verificar directorio de uploads
    const directorioUploads = path.resolve(fileConfig.uploadPath);
    if (!fs.existsSync(directorioUploads)) {
      fs.mkdirSync(directorioUploads, { recursive: true });
    }

    // Intentar escribir un archivo de prueba
    const archivoPrueba = path.join(directorioUploads, ".test-permisos");
    fs.writeFileSync(archivoPrueba, "test");
    fs.unlinkSync(archivoPrueba);
    permisos.directorioUploads = true;
  } catch (error) {
    // No se puede escribir en uploads
  }

  try {
    // Verificar si puede escribir logs
    const directorioLogs = path.resolve("./logs");
    if (!fs.existsSync(directorioLogs)) {
      fs.mkdirSync(directorioLogs, { recursive: true });
    }

    const archivoLogPrueba = path.join(directorioLogs, ".test-logs");
    fs.writeFileSync(archivoLogPrueba, "test log");
    fs.unlinkSync(archivoLogPrueba);
    permisos.puedeEscribirLogs = true;
  } catch (error) {
    // No se puede escribir logs
  }

  try {
    // Verificar si puede crear archivos en el directorio actual
    const archivoPrueba = path.join(process.cwd(), ".test-permisos-general");
    fs.writeFileSync(archivoPrueba, "test");
    fs.unlinkSync(archivoPrueba);
    permisos.puedeCrearArchivos = true;
  } catch (error) {
    // No se puede crear archivos
  }

  return permisos;
};

/**
 * Obtiene información detallada del usuario actual
 */
export const obtenerInfoUsuarioSistema = () => {
  const info: any = {
    plataforma: process.platform,
    esWindows: process.platform === "win32",
    esUnix: ["linux", "darwin", "freebsd", "openbsd"].includes(
      process.platform
    ),
  };

  // Solo en sistemas Unix
  if (info.esUnix && typeof process.getuid === "function") {
    info.uid = process.getuid();
    info.esRoot = info.uid === 0;
    info.mensaje = info.esRoot
      ? "⚠️  EJECUTÁNDOSE COMO ROOT - Riesgo de seguridad"
      : `✅ Ejecutándose con usuario UID: ${info.uid}`;

    if (typeof process.getgid === "function") {
      info.gid = process.getgid();
    }
  } else if (info.esWindows) {
    info.mensaje = "✅ Sistema Windows - Usando permisos de Windows";
  }

  return info;
};

/**
 * Registra el diagnóstico completo en la consola
 */
export const mostrarDiagnosticoCompleto = () => {
  const diagnostico = realizarDiagnosticoSistema();

  console.log("\n🔍 ===== DIAGNÓSTICO DEL SISTEMA =====");
  console.log("👤 Usuario:");
  console.log(`   • Nombre: ${diagnostico.usuario.nombreUsuario}`);
  if (diagnostico.usuario.uid !== undefined) {
    console.log(`   • UID: ${diagnostico.usuario.uid}`);
    console.log(`   • GID: ${diagnostico.usuario.gid}`);
    console.log(
      `   • Es root: ${diagnostico.usuario.uid === 0 ? "⚠️  SÍ" : "✅ No"}`
    );
  }
  console.log(
    `   • Directorio inicio: ${diagnostico.usuario.directorioInicio}`
  );

  console.log("\n🔧 Proceso:");
  console.log(`   • PID: ${diagnostico.proceso.pid}`);
  console.log(`   • Plataforma: ${diagnostico.proceso.plataforma}`);
  console.log(`   • Node.js: ${diagnostico.proceso.version}`);
  console.log(`   • Arquitectura: ${diagnostico.proceso.arquitectura}`);
  console.log(`   • Memoria: ${diagnostico.proceso.memoriaUsada} MB`);
  console.log(
    `   • Directorio trabajo: ${diagnostico.proceso.directorioTrabajo}`
  );

  console.log("\n🔒 Permisos:");
  console.log(
    `   • Uploads: ${diagnostico.permisos.directorioUploads ? "✅" : "❌"}`
  );
  console.log(
    `   • Logs: ${diagnostico.permisos.puedeEscribirLogs ? "✅" : "❌"}`
  );
  console.log(
    `   • Crear archivos: ${
      diagnostico.permisos.puedeCrearArchivos ? "✅" : "❌"
    }`
  );

  if (diagnostico.errores.length > 0) {
    console.log("\n❌ Errores encontrados:");
    diagnostico.errores.forEach((error) => console.log(`   • ${error}`));
  }

  console.log("=====================================\n");

  return diagnostico;
};

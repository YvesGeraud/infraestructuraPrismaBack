const fs = require('fs');
const path = require('path');

console.log('🔧 Corrigiendo TODOS los controladores...\n');

// Función para corregir un archivo específico
function corregirArchivo(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Patrón 1: Asegurar que se obtenga idUsuario si no está presente
    if (content.includes('obtenerIdSesionDesdeJwt(req)') && !content.includes('obtenerIdUsuarioDesdeJwt(req)')) {
      content = content.replace(
        /(\s+)(const idSesion = obtenerIdSesionDesdeJwt\(req\);)/g,
        '$1$2\n$1const idUsuario = obtenerIdUsuarioDesdeJwt(req);'
      );
      modified = true;
    }

    // Patrón 2: Corregir llamadas a crear() - debe tener 3 argumentos
    content = content.replace(
      /(\w+BaseService\.crear\(\w+Data, idSesion\))/g,
      (match) => {
        if (!match.includes('idUsuario')) {
          modified = true;
          return match.replace(/crear\(([^,]+), ([^)]+)\)/, 'crear($1, $2, idUsuario)');
        }
        return match;
      }
    );

    // Patrón 3: Corregir llamadas a actualizar() - debe tener 4 argumentos
    content = content.replace(
      /(\w+BaseService\.actualizar\([^)]+\))/g,
      (match) => {
        // Contar argumentos en la llamada
        const args = match.match(/actualizar\(([^)]+)\)/);
        if (args) {
          const argList = args[1].split(',').map(arg => arg.trim());
          if (argList.length === 3 && !match.includes('idUsuario')) {
            modified = true;
            return match.replace(/actualizar\(([^,]+), ([^,]+), ([^)]+)\)/, 'actualizar($1, $2, $3, idUsuario)');
          }
        }
        return match;
      }
    );

    // Patrón 4: Corregir llamadas a eliminar() - debe tener 3 argumentos
    content = content.replace(
      /(\w+BaseService\.eliminar\([^)]+\))/g,
      (match) => {
        // Contar argumentos en la llamada
        const args = match.match(/eliminar\(([^)]+)\)/);
        if (args) {
          const argList = args[1].split(',').map(arg => arg.trim());
          if (argList.length === 2 && !match.includes('idUsuario')) {
            modified = true;
            return match.replace(/eliminar\(([^,]+), ([^)]+)\)/, 'eliminar($1, $2, idUsuario)');
          }
        }
        return match;
      }
    );

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Corregido: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  Sin cambios: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error en ${filePath}:`, error.message);
    return false;
  }
}

// Buscar todos los controladores
const controllersDir = path.join(__dirname, '../src/controllers');
const allFiles = [];

function findControllers(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findControllers(filePath);
    } else if (file.endsWith('.controller.ts')) {
      allFiles.push(filePath);
    }
  }
}

findControllers(controllersDir);

console.log(`📁 Encontrados ${allFiles.length} controladores\n`);

let correctedCount = 0;
for (const filePath of allFiles) {
  if (corregirArchivo(filePath)) {
    correctedCount++;
  }
}

console.log(`\n✅ Corrección completada!`);
console.log(`📊 Controladores corregidos: ${correctedCount}/${allFiles.length}`);

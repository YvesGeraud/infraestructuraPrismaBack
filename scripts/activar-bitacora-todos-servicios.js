const fs = require('fs');
const path = require('path');

console.log('📝 Activando bitácora automática en TODOS los servicios...\n');

// Buscar todos los servicios
const servicesDir = path.join(__dirname, '../src/services');
const allFiles = [];

function findServices(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findServices(filePath);
    } else if (file.endsWith('.service.ts') && file !== 'BaseService.ts') {
      allFiles.push(filePath);
    }
  }
}

function activarBitacora(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Verificar si ya tiene bitácora activada
    if (content.includes('protected registrarEnBitacora = true')) {
      console.log(`ℹ️  Ya tiene bitácora: ${path.basename(filePath)}`);
      return false;
    }

    // Extraer el nombre del servicio del archivo
    const fileName = path.basename(filePath, '.service.ts');
    
    // Extraer el nombre de la clase del servicio
    const classMatch = content.match(/export class (\w+)BaseService/);
    if (!classMatch) {
      console.log(`⚠️  No se encontró clase BaseService en: ${fileName}`);
      return false;
    }

    const className = classMatch[1];
    
    // Convertir nombre de clase a nombre de tabla
    // Ejemplo: CtLocalidad -> ct_localidad
    let tableName = fileName;
    
    // Si el nombre no tiene _ pero tiene mayúsculas, convertir
    if (!tableName.includes('_') && /[A-Z]/.test(tableName)) {
      tableName = tableName
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .toLowerCase();
    }

    // Buscar el final de la clase (antes del último })
    const lines = content.split('\n');
    let lastBraceIndex = -1;
    let braceCount = 0;
    let insideClass = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detectar inicio de la clase
      if (line.includes(`export class ${className}BaseService`)) {
        insideClass = true;
      }

      if (insideClass) {
        // Contar llaves
        braceCount += (line.match(/\{/g) || []).length;
        braceCount -= (line.match(/\}/g) || []).length;

        // Cuando braceCount vuelve a 0, encontramos el cierre de la clase
        if (braceCount === 0 && line.includes('}')) {
          lastBraceIndex = i;
          break;
        }
      }
    }

    if (lastBraceIndex === -1) {
      console.log(`⚠️  No se encontró el cierre de la clase en: ${fileName}`);
      return false;
    }

    // Verificar si hay comentarios antes del cierre
    let insertIndex = lastBraceIndex;
    
    // Buscar hacia atrás para encontrar el último contenido significativo
    for (let i = lastBraceIndex - 1; i >= 0; i--) {
      const line = lines[i].trim();
      if (line && !line.startsWith('//') && !line.startsWith('/*') && !line.startsWith('*')) {
        insertIndex = i + 1;
        break;
      }
    }

    // Crear el bloque de bitácora
    const bitacoraBlock = [
      '',
      '  // ===========================================',
      '  // 📝 BITÁCORA AUTOMÁTICA ACTIVADA ✅',
      '  // ===========================================',
      '  // BaseService registrará automáticamente CREATE, UPDATE, DELETE',
      '  // en dt_bitacora usando los catálogos de acciones y tablas',
      '',
      '  protected registrarEnBitacora = true;',
      `  protected nombreTablaParaBitacora = "${tableName}"; // Nombre exacto de la tabla`,
    ];

    // Insertar el bloque
    lines.splice(insertIndex, 0, ...bitacoraBlock);

    content = lines.join('\n');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Activada bitácora en: ${fileName} -> tabla: ${tableName}`);
    modified = true;

    return modified;
  } catch (error) {
    console.error(`❌ Error en ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

findServices(servicesDir);

console.log(`📁 Encontrados ${allFiles.length} servicios\n`);

let activatedCount = 0;
const activaciones = [];

for (const filePath of allFiles) {
  if (activarBitacora(filePath)) {
    activatedCount++;
    const fileName = path.basename(filePath, '.service.ts');
    const tableName = fileName.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
    activaciones.push({ archivo: fileName, tabla: tableName });
  }
}

console.log(`\n✅ Activación completada!`);
console.log(`📊 Servicios con bitácora activada: ${activatedCount}/${allFiles.length}`);

if (activaciones.length > 0) {
  console.log('\n📋 Resumen de activaciones:');
  activaciones.forEach(({ archivo, tabla }) => {
    console.log(`   - ${archivo} → tabla: ${tabla}`);
  });
}

console.log(`\n🎉 Ahora TODOS tus servicios registran automáticamente en la bitácora!`);
console.log(`   - CREATE: Cuando creas registros`);
console.log(`   - UPDATE: Cuando actualizas registros`);
console.log(`   - DELETE: Cuando eliminas registros (soft delete)`);
console.log(`\n💡 La bitácora guarda: quién, cuándo, qué cambió, sesión, IP, etc.`);

const fs = require('fs');
const path = require('path');

console.log('🔐 Agregando verificación JWT a rutas protegidas...\n');

// Buscar todos los archivos de rutas
const routesDir = path.join(__dirname, '../src/routes');
const allFiles = [];

function findRoutes(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findRoutes(filePath);
    } else if (file.endsWith('.route.ts')) {
      allFiles.push(filePath);
    }
  }
}

function agregarVerificacionJWT(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Verificar si ya importa verificarAutenticacion
    if (!content.includes('verificarAutenticacion')) {
      // Buscar el import de authMiddleware o agregar uno nuevo
      if (content.includes("from '../middleware/authMiddleware'") || 
          content.includes('from "../../middleware/authMiddleware"')) {
        // Ya tiene import de authMiddleware, agregar verificarAutenticacion
        content = content.replace(
          /(from ['"]\.\.\/\.\.?\/middleware\/authMiddleware['"])/,
          (match) => {
            if (!content.includes('verificarAutenticacion')) {
              return match.replace(
                /import\s*\{([^}]*)\}/,
                (importMatch, imports) => {
                  if (!imports.includes('verificarAutenticacion')) {
                    return importMatch.replace('}', ', verificarAutenticacion }');
                  }
                  return importMatch;
                }
              );
            }
            return match;
          }
        );
      } else {
        // No tiene import de authMiddleware, agregarlo
        const lastImport = content.lastIndexOf('import');
        const nextNewLine = content.indexOf('\n', lastImport);
        const depth = (filePath.match(/\\/g) || []).length - (path.join(__dirname, '../src/routes').match(/\\/g) || []).length;
        const relativePath = '../'.repeat(depth) + 'middleware/authMiddleware';
        
        content = content.slice(0, nextNewLine + 1) + 
          `import { verificarAutenticacion } from "${relativePath}";\n` + 
          content.slice(nextNewLine + 1);
        modified = true;
      }
    }

    // Agregar verificarAutenticacion a rutas POST, PUT, DELETE que no lo tengan
    const lines = content.split('\n');
    const newLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Detectar rutas POST, PUT, DELETE sin verificarAutenticacion
      if ((line.includes('router.post(') || 
           line.includes('router.put(') || 
           line.includes('router.delete(')) &&
          !line.includes('verificarAutenticacion')) {
        
        // Buscar si la siguiente línea tiene verificarAutenticacion
        const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
        
        if (!nextLine.includes('verificarAutenticacion')) {
          newLines.push(line);
          
          // Obtener la indentación
          const indent = line.match(/^\s*/)[0];
          
          // Agregar verificarAutenticacion en la siguiente línea
          newLines.push(`${indent}  verificarAutenticacion,  // 🔐 Middleware de autenticación OBLIGATORIO`);
          modified = true;
          continue;
        }
      }
      
      newLines.push(line);
    }

    if (modified) {
      content = newLines.join('\n');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Protegido: ${path.relative(path.join(__dirname, '..'), filePath)}`);
      return true;
    } else {
      console.log(`ℹ️  Ya protegido: ${path.relative(path.join(__dirname, '..'), filePath)}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error en ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

findRoutes(routesDir);

console.log(`📁 Encontrados ${allFiles.length} archivos de rutas\n`);

let protectedCount = 0;
for (const filePath of allFiles) {
  if (agregarVerificacionJWT(filePath)) {
    protectedCount++;
  }
}

console.log(`\n✅ Protección completada!`);
console.log(`📊 Rutas protegidas: ${protectedCount}/${allFiles.length}`);
console.log(`\n🔐 Ahora todas las rutas POST/PUT/DELETE requieren JWT!`);

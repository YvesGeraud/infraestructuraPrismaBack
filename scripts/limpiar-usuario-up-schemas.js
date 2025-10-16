/**
 * Script para limpiar id_ct_usuario_up de todos los schemas de actualización
 * Ya que se obtiene automáticamente del JWT
 */

const fs = require('fs');
const path = require('path');

// Lista de archivos que contienen id_ct_usuario_up
const archivos = [
  'src/schemas/inventario/ct_inventario_alta.schema.ts',
  'src/schemas/inventario/dt_inventario_articulo.schema.ts',
  'src/schemas/inventario/ct_inventario_tipo_articulo.schema.ts',
  'src/schemas/inventario/ct_inventario_proveedor.schema.ts',
  'src/schemas/inventario/ct_inventario_subclase.schema.ts',
  'src/schemas/inventario/ct_inventario_marca.schema.ts',
  'src/schemas/inventario/ct_inventario_material.schema.ts',
  'src/schemas/inventario/ct_inventario_color.schema.ts',
  'src/schemas/inventario/ct_inventario_estado_fisico.schema.ts',
  'src/schemas/inventario/ct_inventario_clase.schema.ts',
  'src/schemas/inventario/ct_inventario_baja.schema.ts',
  'src/schemas/infraestructura/dt_infraestructura_ubicacion.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_tipo_instancia.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_tipo_escuela.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_supervisor.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_sostenimiento.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_escuela.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_jefe_sector.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_direccion.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_departamento.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_area.schema.ts',
  'src/schemas/infraestructura/ct_infraestructura_anexo.schema.ts',
  'src/schemas/ct_entidad.schema.ts',
  'src/schemas/ct_bitacora_accion.schema.ts',
  'src/schemas/ct_bitacora_tabla.schema.ts',
];

function limpiarArchivo(archivo) {
  const rutaCompleta = path.join(__dirname, '..', archivo);
  
  if (!fs.existsSync(rutaCompleta)) {
    console.log(`⚠️  Archivo no encontrado: ${archivo}`);
    return;
  }

  let contenido = fs.readFileSync(rutaCompleta, 'utf8');
  let modificado = false;

  // Patrón para encontrar líneas con id_ct_usuario_up
  const patron = /^\s*id_ct_usuario_up:\s*esquemaUsuarioCreacion,?\s*$/gm;
  
  if (patron.test(contenido)) {
    // Reemplazar la línea con un comentario
    contenido = contenido.replace(patron, '  // id_ct_usuario_up se obtiene automáticamente del JWT');
    modificado = true;
  }

  if (modificado) {
    fs.writeFileSync(rutaCompleta, contenido, 'utf8');
    console.log(`✅ Limpiado: ${archivo}`);
  } else {
    console.log(`ℹ️  Sin cambios: ${archivo}`);
  }
}

console.log('🧹 Iniciando limpieza de id_ct_usuario_up en schemas...\n');

archivos.forEach(limpiarArchivo);

console.log('\n✅ Limpieza completada!');
console.log('📝 Todos los schemas de actualización ahora obtienen id_ct_usuario_up del JWT automáticamente.');

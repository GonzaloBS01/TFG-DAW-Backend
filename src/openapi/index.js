import yaml from 'js-yaml';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Función para cargar archivos YAML
function loadYamlFile(filename) {
  try {
    return yaml.load(readFileSync(resolve(__dirname, filename), 'utf8'));
  } catch (error) {
    console.error(`Error al cargar archivo YAML ${filename}:`, error);
    return {};
  }
}

// Cargar archivos YAML
const authSpec = loadYamlFile('auth.yaml');
const userSpec = loadYamlFile('user.yaml');
const productSpec = loadYamlFile('product.yaml');
const billSpec = loadYamlFile('bill.yaml');
const cartSpec = loadYamlFile('cart.yaml'); // Añadir esta línea

// Añadir justo después de cargar los archivos YAML
console.log('Archivos cargados:');
console.log('auth.yaml:', Object.keys(authSpec).length > 0 ? 'Cargado correctamente' : 'Vacío o con errores');
console.log('user.yaml:', Object.keys(userSpec).length > 0 ? 'Cargado correctamente' : 'Vacío o con errores');
console.log('product.yaml:', Object.keys(productSpec).length > 0 ? 'Cargado correctamente' : 'Vacío o con errores');
console.log('bill.yaml:', Object.keys(billSpec).length > 0 ? 'Cargado correctamente' : 'Vacío o con errores');
console.log('cart.yaml:', Object.keys(cartSpec).length > 0 ? 'Cargado correctamente' : 'Vacío o con errores'); // Añadir esta línea

// Función para combinar componentes
function mergeComponents(target = {}, source) {
  if (!source || !source.components) return target;

  const result = { ...target };

  for (const [key, value] of Object.entries(source.components)) {
    if (!result[key]) {
      result[key] = {};
    }
    result[key] = { ...result[key], ...value };
  }

  return result;
}

// Función para combinar rutas
function mergePaths(target = {}, source) {
  if (!source || !source.paths) return target;
  return { ...target, ...source.paths };
}

// Crear la especificación OpenAPI combinada
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'TFG-DAW Backend API',
    version: '1.0.0',
    description: 'API para el proyecto TFG-DAW Backend',
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Servidor de desarrollo',
    },
  ],
  paths: {},
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

// Combinar todas las especificaciones
openApiSpec.paths = mergePaths(openApiSpec.paths, authSpec);
openApiSpec.paths = mergePaths(openApiSpec.paths, userSpec);
openApiSpec.paths = mergePaths(openApiSpec.paths, productSpec);
openApiSpec.paths = mergePaths(openApiSpec.paths, billSpec);
openApiSpec.paths = mergePaths(openApiSpec.paths, cartSpec); // Añadir esta línea

openApiSpec.components = mergeComponents(openApiSpec.components, authSpec);
openApiSpec.components = mergeComponents(openApiSpec.components, userSpec);
openApiSpec.components = mergeComponents(openApiSpec.components, productSpec);
openApiSpec.components = mergeComponents(openApiSpec.components, billSpec);
openApiSpec.components = mergeComponents(openApiSpec.components, cartSpec); // Añadir esta línea

// Añadir a index.js antes de la exportación
console.log('Rutas cargadas:', Object.keys(openApiSpec.paths).length);
console.log('Rutas de autenticación:', Object.keys(authSpec.paths || {}).length);
console.log('Rutas de usuarios:', Object.keys(userSpec.paths || {}).length);
console.log('Rutas de productos:', Object.keys(productSpec.paths || {}).length);
console.log('Rutas de facturas:', Object.keys(billSpec.paths || {}).length);
console.log('Rutas de carrito:', Object.keys(cartSpec.paths || {}).length); // Añadir esta línea

export default openApiSpec;

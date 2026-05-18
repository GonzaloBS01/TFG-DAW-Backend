
# TFG-DAW-Backend

Backend RESTful para el Trabajo de Fin de Grado (TFG) de Desarrollo de Aplicaciones Web.

Breve y funcional: API construida con Node.js, Express y MongoDB, pensada para gestión de usuarios, autenticación, catálogo de productos y procesos de compra.

## Características

- API REST con rutas para usuarios, productos, carrito y facturación.
- Autenticación basada en JWT.
- Documentación OpenAPI/Swagger integrada.
- Envío de correos y generación de PDFs (según configuración de servicios).
- Tests unitarios con `jest` y análisis estático con `eslint`.

## Tecnologías

- Node.js
- Express
- MongoDB (Mongoose)
- JWT
- Swagger (OpenAPI)
- Jest
- ESLint

## Requisitos

- Node.js (recomendado LTS)
- MongoDB (local o Atlas)
- npm or yarn

## Instalación rápida

1. Clona el repositorio:

```bash
git clone <URL_DEL_REPOSITORIO>
cd TFG-DAW-Backend
```

2. Instala dependencias:

```bash
npm install
```

3. Crea y configura el `.env` (usa `.env.template` si existe):

```bash
cp .env.template .env
# editar .env con MONGO_URL, SECRET_KEY, EMAIL_USER, etc.
```

4. Ejecuta en desarrollo:

```bash
npm run dev
```

## Variables de entorno (mínimas)

- `PORT` — puerto de la API (por defecto 3000)
- `MONGO_URL` — cadena de conexión a MongoDB
- `SECRET_KEY` — clave para JWT
- `EMAIL_USER`, `EMAIL_PASSWORD` — para envío de correos (opcional)
- `FRONTEND_URL` — origen permitido para CORS (opcional)

## Scripts útiles

- `npm run dev` — modo desarrollo (nodemon)
- `npm start` — iniciar en producción
- `npm test` — ejecutar pruebas
- `npm run test:coverage` — pruebas + cobertura
- `npm run lint` — ejecutar ESLint
- `npm run fix` — intentar arreglar problemas de lint

## Documentación de la API

Swagger UI está disponible en `http://localhost:<PORT>/api-docs` cuando la app está en ejecución. También hay especificaciones en `src/openapi`.

## Estructura principal

- `src/` — código fuente
  - `config/`, `controllers/`, `loaders/`, `middlewares/`, `models/`, `router/`, `services/`, `utils/`, `openapi/`

## Tests y Calidad

Usa `npm test` para ejecutar las pruebas unitarias y `npm run lint` para revisar estilo y errores estáticos.

## Contribuir

1. Crea una rama de feature: `git checkout -b feat/descripcion`
2. Haz commits claros y pequeños.
3. Abre un PR describiendo los cambios.

## Autor

GonzaloBS01

---

Si quieres, puedo también:

- Añadir badges (build, coverage) al inicio del README.
- Actualizar `package.json` con un `prepare` o `husky`.

Dime qué prefieres.

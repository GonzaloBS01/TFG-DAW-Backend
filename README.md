
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


Backend RESTful para el Trabajo de Fin de Grado (TFG) — API construida con Node.js, Express y MongoDB.

Resumen
-------

API orientada a e‑commerce con rutas para usuarios, autenticación, catálogo de productos, carrito y facturación. Incluye documentación OpenAPI, envío de correos y generación básica de PDFs.

Características principales
-------------------------

- Autenticación con JWT
- CRUD de productos y gestión de carrito
- Rutas para facturación y pedidos
- Documentación Swagger (OpenAPI)
- Tests con `jest` y linting con `eslint`

Stack técnico
-------------

- Node.js + Express
- MongoDB (Mongoose)
- JWT para auth
- Swagger (OpenAPI)

Requisitos
---------

- Node.js (LTS recomendado)
- MongoDB (local o Atlas)
- npm o yarn

Instalación rápida
------------------

```bash
git clone <URL_DEL_REPOSITORIO>
cd TFG-DAW-Backend
npm install
```

Configurar variables de entorno
-------------------------------

Copia la plantilla y edita los valores necesarios:

```bash
cp .env.template .env
# o crea .env con las variables listadas abajo
```

Ejemplo mínimo de `.env`:

```env
PORT=3001
MONGO_URL=mongodb://localhost:27017/mi_base_de_datos
SECRET_KEY=tu_clave_secreta
EMAIL_USER=correo@ejemplo.com
EMAIL_PASSWORD=contraseña_o_token
FRONTEND_URL=http://localhost:4200
```

Variables de entorno (detalles y valores por defecto detectados)
-------------------------------------------------------------

- `PORT` — puerto donde escucha la API (valor por defecto en código: `3001`)
- `MONGO_URL` — URI de MongoDB (por defecto: `mongodb://localhost:27017/mi_base_de_datos`)
- `SECRET_KEY` — clave para firmar JWT (sin valor por defecto: debes configurarla)
- `EMAIL_USER`, `EMAIL_PASSWORD` — credenciales para envío de correos (opcional)
- `FRONTEND_URL` — origen permitido para CORS (por defecto en código: `http://localhost:4200`)

Puertos y servicios usados
--------------------------

- API: `PORT` → por defecto `3001` (configurable).
- MongoDB: `27017` (docker-compose mapea `27017:27017`).
- Frontend de desarrollo: `4200` (Angular CLI por defecto — usado en `FRONTEND_URL`).
- Swagger UI: `http://localhost:<PORT>/api-docs`.
- SonarQube (opcional en `docker-compose`): host `2000` → container `9000`.

Si usas `docker-compose.yml` incluido, los servicios definidos son `mongodb` y `sonarqube`.

Comandos útiles
---------------

- Ejecutar en desarrollo:

```bash
npm run dev
```

- Ejecutar en producción:

```bash
npm start
```

- Tests:

```bash
npm test
npm run test:coverage
```

- Lint:

```bash
npm run lint
npm run fix
```

Documentación de la API
----------------------

Accede a Swagger UI cuando la app esté en ejecución en:

```
http://localhost:<PORT>/api-docs
```

Ejemplos rápidos (curl)
-----------------------

Login (ejemplo):

```bash
curl -X POST http://localhost:3001/api/login -H "Content-Type: application/json" -d '{"email":"user@example.com","password":"pass"}'
```

Obtener productos (ejemplo público):

```bash
curl http://localhost:3001/api/products
```

Nota: adapta las rutas según tu configuración; las rutas principales están en `src/router/`.

Estructura del proyecto
-----------------------

- `src/` — código fuente
  - `config/` — configuración y middlewares
  - `controllers/` — controladores de rutas
  - `loaders/` — inicializadores (BD, servicios)
  - `middlewares/` — middlewares Express
  - `models/` — esquemas Mongoose
  - `router/` — definición de rutas
  - `services/` — lógica de negocio
  - `openapi/` — especificaciones OpenAPI

Contribuir
----------

1. Crea una rama: `git checkout -b feat/mi-cambio`
2. Haz commits pequeños y descriptivos.
3. Abre un Pull Request con la descripción de los cambios.

Preguntas frecuentes / notas
---------------------------

- ¿Dónde están las rutas? Mira `src/router/`.
- ¿Cómo cambio el puerto? Modifica la variable `PORT` en `.env` o exporta `PORT` en el entorno.

Autor
-----

GonzaloBS01

---

¿Quieres que añada badges (build, coverage) en el encabezado o incluya ejemplos de peticiones más completos (autenticación con token, subida de imágenes)?


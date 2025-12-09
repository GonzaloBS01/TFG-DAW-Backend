# TFG-DAW-Backend

Repositorio del backend para el Trabajo de Fin de Grado (TFG) de Desarrollo de Aplicaciones Web.

## Descripción

Este proyecto proporciona la API RESTful para el TFG. Está construido utilizando Node.js y Express, con MongoDB como base de datos. Incluye autenticación, gestión de usuarios, y otras funcionalidades necesarias para la aplicación.

## Tecnologías Utilizadas

*   **Node.js**: Entorno de ejecución para JavaScript.
*   **Express**: Framework web para Node.js.
*   **MongoDB**: Base de datos NoSQL (usando Mongoose como ODM).
*   **JWT (JSON Web Tokens)**: Para autenticación segura.
*   **Swagger**: Para la documentación de la API.
*   **Jest**: Framework de pruebas unitarias.
*   **Eslint**: Herramienta de linting para asegurar la calidad del código.

## Prerrequisitos

Asegúrate de tener instalado lo siguiente en tu sistema:

*   [Node.js](https://nodejs.org/) (versión recomendada: LTS)
*   [MongoDB](https://www.mongodb.com/) (local o Atlas)
*   [npm](https://www.npmjs.com/) (normalmente viene con Node.js)

## Instalación

1.  Clona este repositorio:

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    ```

2.  Navega al directorio del proyecto:

    ```bash
    cd TFG-DAW-Backend
    ```

3.  Instala las dependencias:

    ```bash
    npm install
    ```

## Configuración

1.  Crea un archivo `.env` en la raíz del proyecto basándote en el archivo de plantilla `.env.template`:

    ```bash
    cp .env.template .env
    ```

2.  Abre el archivo `.env` y configura las siguientes variables de entorno:

    *   `PORT`: Puerto en el que se ejecutará el servidor (ej. 3000).
    *   `MONGO_URL`: Cadena de conexión a tu base de datos MongoDB.
    *   `SECRET_KEY`: Clave secreta para firmar los tokens JWT.
    *   `EMAIL_USER`: Correo electrónico para el envío de notificaciones (si aplica).
    *   `EMAIL_PASSWORD`: Contraseña o token de aplicación para el correo.
    *   `FRONTEND_URL`: URL del frontend para CORS.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`

Ejecuta la aplicación en modo desarrollo utilizando `nodemon`. El servidor se reiniciará automáticamente si realizas cambios en el código.

### `npm start`

Ejecuta la aplicación en modo producción.

### `npm test`

Lanza el runner de pruebas `jest`.

### `npm run test:coverage`

Ejecuta las pruebas y genera un reporte de cobertura de código.

### `npm run lint`

Ejecuta `eslint` para analizar el código en busca de problemas y errores de estilo.

### `npm run fix`

Intenta corregir automáticamente los problemas de linting encontrados.

## Estructura del Proyecto

La estructura principal del código fuente se encuentra en la carpeta `src`:

*   `src/config`: Archivos de configuración de la aplicación y base de datos.
*   `src/controllers`: Controladores que manejan la lógica de las peticiones.
*   `src/loaders`: Scripts de inicialización (ej. conexión a BBDD).
*   `src/middlewares`: Middlewares de Express (autenticación, manejo de errores, etc.).
*   `src/models`: Modelos de Mongoose (esquemas de BBDD).
*   `src/openapi`: Definiciones para la documentación con Swagger.
*   `src/router`: Definición de las rutas de la API.
*   `src/services`: Capa de servicios que contiene la lógica de negocio.
*   `src/utils`: Funciones de utilidad y helpers.

## API Documentation

La documentación de la API está disponible a través de Swagger UI. Una vez iniciada la aplicación, visita:

`http://localhost:<PORT>/api-docs` (Asegúrate de verificar la ruta exacta en `src/app.js` o `src/index.js`)

## Autor

GonzaloBS01

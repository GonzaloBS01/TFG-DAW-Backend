import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TFG-DAW Backend API',
      version: '1.0.0',
      description: 'Documentación de la API para el proyecto TFG-DAW Backend',
    },
    servers: [
      {
        url: 'http://localhost:3000/api/v1',
        description: 'Servidor local',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            email: {
              type: 'string',
              description: 'Correo electrónico del usuario',
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
            },
          },
        },
        UserInput: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'Nombre del usuario',
            },
            email: {
              type: 'string',
              description: 'Correo electrónico del usuario',
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario',
            },
          },
        },
      },
    },
  },
  apis: ['./src/router/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;

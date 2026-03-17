const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CRUD API Documentation",
      version: "1.0.0",
      description: "API docs for my backend project"
    },
    servers: [
      {
        url: "https://improved-barnacle-x566xjw49qw42ppp6-3000.app.github.dev"
      }
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      }
    }
  },

  apis: [process.cwd() + "/Routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
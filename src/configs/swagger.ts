const swaggerJSDoc = require('swagger-jsdoc');

import { PORT } from './constants';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HookShot API',
      version: '1.0.0',
      description: 'Reliable webhook delivery with retry logic and DLQ',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api`,
      },
    ],
    components: {
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'error',
            },
            httpStatus: {
              type: 'integer',
              example: 500,
            },
            message: {
              type: 'string',
              example: 'Internal server error',
            },
            data: {
              oneOf: [{ type: 'object' }, { type: 'array' }],
              example: [],
            },
          },
        },
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-key',
        },
      },
      responses: {
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
      },
      security: [
        {
          ApiKeyAuth: [],
        },
      ],
    },
  },
  apis: ['./src/api/routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);

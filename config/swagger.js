const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const express = require('express');
const app = express();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Book Selling Platform API',
    version: '1.0.0',
    description: 'API documentation for the Book Selling Platform',
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
    {
      url: 'http://localhost:3001',
      description: 'Production server',
    },
  ],
  components: {
    schemas: {
      Book: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          title: {
            type: 'string',
          },
          author: {
            type: 'string',
          },
          isbn: {
            type: 'string',
          },
          publishedDate: {
            type: 'string',
            format: 'date',
          },
          price: {
            type: 'number',
            format: 'float',
          },
          stock: {
            type: 'integer',
          },
          genre: {
            type: 'string',
          },
        },
        required: ['title', 'author', 'isbn', 'publishedDate', 'price', 'stock', 'genre'],
      },
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
          },
          username: {
            type: 'string',
          },
          password: {
            type: 'string',
          },
          role: {
            type: 'string',
            enum: ['Admin', 'Seller', 'Buyer'],
          },
        },
        required: ['username', 'password', 'role'],
      },
      Analytics: {
        type: 'object',
        properties: {
          topSellingBooks: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                genre: {
                  type: 'string',
                },
                books: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      title: {
                        type: 'string',
                      },
                      author: {
                        type: 'string',
                      },
                      sales: {
                        type: 'integer',
                      },
                    },
                    required: ['title', 'author', 'sales'],
                  },
                },
              },
              required: ['genre', 'books'],
            },
          },
          userPurchasePatterns: {
            type: 'object',
            properties: {
              userId: {
                type: 'string',
                format: 'uuid',
              },
              purchases: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    bookId: {
                      type: 'string',
                      format: 'uuid',
                    },
                    quantity: {
                      type: 'integer',
                    },
                    date: {
                      type: 'string',
                      format: 'date',
                    },
                  },
                  required: ['bookId', 'quantity', 'date'],
                },
              },
            },
            required: ['userId', 'purchases'],
          },
          salesTrends: {
            type: 'object',
            properties: {
              trendData: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    date: {
                      type: 'string',
                      format: 'date',
                    },
                    totalSales: {
                      type: 'number',
                      format: 'float',
                    },
                  },
                  required: ['date', 'totalSales'],
                },
              },
            },
            required: ['trendData'],
          },
        },
      },
    },
  },
};

// Swagger options
const options = {
  swaggerDefinition,
  apis: [
    // path.join(__dirname, "routes/analyticsRoutes.js"),
    // path.join(__dirname, "routes/bookRoutes.js"),
    // path.join(__dirname, "routes/userRoutes.js")
    './routes/**/*.js'
  ],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = swaggerSpec;

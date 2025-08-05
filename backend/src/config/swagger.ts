import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Academix API',
      version: '1.0.0',
      description: 'A comprehensive API for the Academix educational platform',
      contact: {
        name: 'Academix Team',
        email: 'support@academix.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development server'
      },
      {
        url: 'https://api.academix.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'firstName', 'lastName'],
          properties: {
            _id: {
              type: 'string',
              description: 'User ID'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            firstName: {
              type: 'string',
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              description: 'User last name'
            },
            role: {
              type: 'string',
              enum: ['student', 'admin', 'faculty'],
              description: 'User role'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether user is active'
            },
            isVerified: {
              type: 'boolean',
              description: 'Whether user email is verified'
            },
            avatar: {
              type: 'string',
              description: 'User avatar URL'
            },
            lastLogin: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Student: {
          type: 'object',
          properties: {
            _id: {
              type: 'string'
            },
            user: {
              type: 'string',
              description: 'Reference to User ID'
            },
            studentId: {
              type: 'string',
              description: 'Student ID number'
            },
            department: {
              type: 'string',
              description: 'Reference to Department ID'
            },
            yearOfStudy: {
              type: 'number',
              minimum: 1,
              maximum: 6
            },
            gpa: {
              type: 'number',
              minimum: 0,
              maximum: 4
            },
            credits: {
              type: 'number',
              minimum: 0
            }
          }
        },
        Department: {
          type: 'object',
          required: ['name'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              description: 'Department name'
            },
            code: {
              type: 'string',
              description: 'Department code'
            },
            description: {
              type: 'string',
              description: 'Department description'
            },
            head: {
              type: 'string',
              description: 'Reference to department head User ID'
            },
            building: {
              type: 'string',
              description: 'Reference to Building ID'
            }
          }
        },
        Course: {
          type: 'object',
          required: ['name', 'code', 'credits', 'department'],
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string',
              description: 'Course name'
            },
            code: {
              type: 'string',
              description: 'Course code'
            },
            description: {
              type: 'string',
              description: 'Course description'
            },
            credits: {
              type: 'number',
              minimum: 1,
              maximum: 6
            },
            department: {
              type: 'string',
              description: 'Reference to Department ID'
            },
            prerequisites: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of prerequisite course IDs'
            },
            semester: {
              type: 'number',
              enum: [1, 2],
              description: 'Semester (1 or 2)'
            },
            year: {
              type: 'number',
              minimum: 1,
              maximum: 6
            }
          }
        },
        Post: {
          type: 'object',
          required: ['title', 'content', 'author'],
          properties: {
            _id: {
              type: 'string'
            },
            title: {
              type: 'string',
              maxLength: 200,
              description: 'Post title'
            },
            content: {
              type: 'string',
              description: 'Post content'
            },
            author: {
              type: 'string',
              description: 'Reference to User ID'
            },
            category: {
              type: 'string',
              enum: ['general', 'academic', 'events', 'clubs', 'announcements'],
              description: 'Post category'
            },
            tags: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Post tags'
            },
            isAnonymous: {
              type: 'boolean',
              default: false,
              description: 'Whether post is anonymous'
            },
            likes: {
              type: 'number',
              default: 0,
              description: 'Number of likes'
            },
            comments: {
              type: 'number',
              default: 0,
              description: 'Number of comments'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              },
              description: 'Detailed validation errors'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Academix API Documentation'
  }));
  
  // Serve the JSON spec
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;

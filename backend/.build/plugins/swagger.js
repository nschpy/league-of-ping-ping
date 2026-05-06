import fp from 'fastify-plugin';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import { env } from '../config/env.js';
export const swaggerPlugin = fp(async (fastify) => {
    await fastify.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'League of Ping Pong API',
                description: 'Competitive table tennis platform with MMR rating system',
                version: '1.0.0',
            },
            servers: [{ url: `http://localhost:${env.port}` }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            tags: [
                { name: 'Auth', description: 'Sign up / sign in / current user' },
                { name: 'Users', description: 'User profiles, history, profile update' },
                { name: 'Games', description: 'Match lifecycle (referee/admin)' },
                { name: 'Leaderboard', description: 'Rankings and personal rank' },
                { name: 'MMR', description: 'Elo forecast preview' },
                { name: 'Health', description: 'Service health check' },
            ],
        },
    });
    await fastify.register(fastifySwaggerUi, {
        routePrefix: '/docs',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: true,
            persistAuthorization: true,
        },
    });
});
export default swaggerPlugin;
//# sourceMappingURL=swagger.js.map
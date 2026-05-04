import Fastify from 'fastify';

const application = Fastify({ 
    logger: true
});

application.get('/', async (request, reply) => {
    return { message: 'Hello World' };
});

application.listen({ port: 3000 }, (err, address) => {
    if (err) {
        application.log.error(err);
        process.exit(1);
    }
});
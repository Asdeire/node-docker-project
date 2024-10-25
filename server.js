const fastify = require('fastify')({ logger: true });

// Log every request
fastify.addHook('onRequest', async (request, reply) => {
  request.log.info(`Received ${request.method} request for ${request.url}`);
});

fastify.get('/hello', async (request, reply) => {
  return { message: 'Hello World!' };
});

fastify.get('/api/resources', async (request, reply) => {
  return [{ id: 1, name: 'Resource 1' }];
});

fastify.get('/api/resources/:id', async (request, reply) => {
  const { id } = request.params;
  return { id, name: `Resource ${id}` };
});

fastify.post('/api/resources', async (request, reply) => {
  const { name } = request.body;
  return { id: new Date().getTime(), name };
});

fastify.put('/api/resources/:id', async (request, reply) => {
  const { id } = request.params;
  const { name } = request.body;
  return { id, name: name || `Updated Resource ${id}` };
});

fastify.delete('/api/resources/:id', async (request, reply) => {
  const { id } = request.params;
  return { message: `Resource ${id} deleted` };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

const fastify = Fastify({
  exposeHeadRoutes: false,
  connectionTimeout: 20000,
  ignoreTrailingSlash: false,
  logger: {
    level: "debug",
    transport: {
      target: "@mgcrea/pino-pretty-compact",
      options: {
        colorize: true,
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
  disableRequestLogging: true,
});

// Array to store resources
let resources = [];

// Log each request
fastify.addHook('onRequest', async (request, reply) => {
  request.log.info(`Received ${request.method} request for ${request.url}`);
});

// Get all resources
fastify.get('/api/resources', async (request, reply) => {
  return resources;
});

// Get resource by ID
fastify.get('/api/resources/:id', async (request, reply) => {
  const { id } = request.params;
  const resource = resources.find(r => r.id === parseInt(id));
  if (!resource) {
    return reply.status(404).send({ message: `Resource ${id} not found` });
  }
  return resource;
});

// Add new resource
fastify.post('/api/resources', async (request, reply) => {
  const { name } = request.body;
  const newResource = { id: new Date().getTime(), name };
  resources.push(newResource);
  return newResource;
});

// Update resource
fastify.put('/api/resources/:id', async (request, reply) => {
  const { id } = request.params;
  const { name } = request.body;
  const resourceIndex = resources.findIndex(r => r.id === parseInt(id));
  
  if (resourceIndex === -1) {
    return reply.status(404).send({ message: `Resource ${id} not found` });
  }

  resources[resourceIndex].name = name || `Updated Resource ${id}`;
  return resources[resourceIndex];
});

// Delete resource
fastify.delete('/api/resources/:id', async (request, reply) => {
  const { id } = request.params;
  const resourceIndex = resources.findIndex(r => r.id === parseInt(id));
  
  if (resourceIndex === -1) {
    return reply.status(404).send({ message: `Resource ${id} not found` });
  }

  resources.splice(resourceIndex, 1);
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

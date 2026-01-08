import { FastifyInstance, FastifyPluginOptions } from 'fastify';

async function healthRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> {
  fastify.get('/health', async (_request, _reply) => {
    return { 
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  });
}

export default healthRoutes;


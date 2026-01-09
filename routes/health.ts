import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getHealthDoc } from '../docs/routes/health.js';

async function healthRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> {
  fastify.get('/health', {
    schema: getHealthDoc
  }, async (_request, _reply) => {
    return { 
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  });
}

export default healthRoutes;


import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { getIndexDoc } from '../docs/routes/index.js';

async function routes(fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> {
  fastify.get('/', {
    schema: getIndexDoc
  }, async (_request, _reply) => {
    return { 
      message: 'Bem-vindo ao Fastify!',
      status: 'online'
    };
  });
}

export default routes;


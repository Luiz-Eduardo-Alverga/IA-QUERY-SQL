import { FastifyInstance, FastifyPluginOptions } from 'fastify';

async function routes(fastify: FastifyInstance, _options: FastifyPluginOptions): Promise<void> {
  fastify.get('/', async (_request, _reply) => {
    return { 
      message: 'Bem-vindo ao Fastify!',
      status: 'online'
    };
  });
}

export default routes;


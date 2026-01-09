import { FastifyInstance } from 'fastify';
import { AIService } from '../services/ai-service.js';
import { QueryRequest } from '../types/database.js';

export default async function queryRoutes(
  fastify: FastifyInstance,
  // options: FastifyPluginOptions
): Promise<void> {
  const aiService = fastify.aiService as AIService;

  // POST /api/query - Gerar SQL a partir de linguagem natural
  fastify.post<{ Body: QueryRequest }>('/api/query', async (request, reply) => {
    try {
      // Validação básica
      if (!request.body.question || request.body.question.trim().length === 0) {
        reply.code(400);
        return {
          success: false,
          error: 'A pergunta é obrigatória'
        };
      }

      const startTime = Date.now();
      const response = await aiService.generateSQL(request.body);
      const duration = Date.now() - startTime;

      fastify.log.info(`SQL gerado em ${duration}ms: ${request.body.question.substring(0, 50)}...`);

      return {
        success: true,
        ...response,
        generatedIn: `${duration}ms`
      };
    } catch (error: any) {
      fastify.log.error('Erro ao gerar SQL:', error);
      reply.code(400);
      return {
        success: false,
        error: error.message || 'Erro ao gerar SQL'
      };
    }
  });
}


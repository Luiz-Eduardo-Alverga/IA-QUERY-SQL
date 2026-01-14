import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { AIService } from '../services/ai-service.js';
import { getMetricsDoc, deleteMetricsDoc } from '../docs/routes/metrics.js';

export default async function metricsRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const aiService = fastify.aiService as AIService;

  // GET /api/metrics - Obter métricas agregadas
  fastify.get('/api/metrics', {
    schema: getMetricsDoc
  }, async (_request, reply) => {
    try {
      const metricsService = aiService.getMetricsService();
      const metrics = metricsService.getAggregatedMetrics();

      return {
        success: true,
        metrics
      };
    } catch (error: any) {
      fastify.log.error('Erro ao obter métricas:', error);
      reply.code(500);
      return {
        success: false,
        error: error.message || 'Erro ao obter métricas'
      };
    }
  });

  // DELETE /api/metrics - Limpar métricas
  fastify.delete('/api/metrics', {
    schema: deleteMetricsDoc
  }, async (_request, reply) => {
    try {
      const metricsService = aiService.getMetricsService();
      metricsService.clearMetrics();

      return {
        success: true,
        message: 'Métricas limpas com sucesso'
      };
    } catch (error: any) {
      fastify.log.error('Erro ao limpar métricas:', error);
      reply.code(500);
      return {
        success: false,
        error: error.message || 'Erro ao limpar métricas'
      };
    }
  });
}

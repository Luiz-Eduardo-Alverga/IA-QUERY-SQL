import { metricsResponseSchema } from '../schemas/metrics.js';
import { errorResponseSchema } from '../schemas/database.js';

export const getMetricsDoc = {
  description: 'Retorna métricas agregadas sobre as requisições de geração de SQL',
  tags: ['metrics'],
  summary: 'Obter métricas de performance',
  response: {
    200: {
      description: 'Métricas retornadas com sucesso',
      ...metricsResponseSchema
    },
    500: {
      description: 'Erro interno do servidor',
      ...errorResponseSchema
    }
  }
};

export const deleteMetricsDoc = {
  description: 'Limpa todas as métricas coletadas',
  tags: ['metrics'],
  summary: 'Limpar métricas',
  response: {
    200: {
      description: 'Métricas limpas com sucesso',
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' }
      }
    },
    500: {
      description: 'Erro interno do servidor',
      ...errorResponseSchema
    }
  }
};

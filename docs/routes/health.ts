export const getHealthDoc = {
  description: 'Health check do servidor - verifica se a API está online',
  tags: ['health'],
  summary: 'Health check',
  response: {
    200: {
      description: 'Servidor está online',
      type: 'object',
      properties: {
        status: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
      }
    }
  }
};


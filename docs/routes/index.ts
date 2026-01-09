export const getIndexDoc = {
  description: 'Rota principal de boas-vindas da API',
  tags: ['health'],
  summary: 'Bem-vindo',
  response: {
    200: {
      description: 'Mensagem de boas-vindas',
      type: 'object',
      properties: {
        message: { type: 'string' },
        status: { type: 'string' }
      }
    }
  }
};


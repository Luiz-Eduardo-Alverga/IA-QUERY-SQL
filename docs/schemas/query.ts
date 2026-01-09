export const queryRequestSchema = {
  type: 'object',
  required: ['question'],
  properties: {
    question: {
      type: 'string',
      description: 'Pergunta em linguagem natural para gerar SQL'
    },
    context: {
      type: 'string',
      description: 'Contexto adicional opcional para a query'
    }
  }
};

export const queryResponseSchema = {
  type: 'object',
  properties: {
    success: { 
      type: 'boolean'
    },
    sql: {
      type: 'string',
      description: 'SQL gerado pela IA'
    },
    explanation: {
      type: 'string',
      description: 'Explicação da query gerada'
    },
    confidence: {
      type: 'number',
      description: 'Nível de confiança da IA (0-1)'
    },
    generatedIn: {
      type: 'string',
      description: 'Tempo de geração'
    }
  }
};


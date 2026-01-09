import {
  databaseSchemaSchema,
  schemaUpdateSchema,
  schemaResponseSchema,
  schemaUpdateResponseSchema,
  schemaGetResponseSchema,
  errorResponseSchema
} from '../schemas/database.js';

export const postSchemaDoc = {
  description: 'Configura ou atualiza o schema completo do banco de dados. Substitui qualquer schema existente.',
  tags: ['schema'],
  summary: 'Configurar schema do banco',
  body: databaseSchemaSchema,
  response: {
    200: {
      description: 'Schema configurado com sucesso',
      ...schemaResponseSchema
    },
    400: {
      description: 'Erro de validação - schema inválido',
      ...errorResponseSchema
    },
    500: {
      description: 'Erro interno do servidor',
      ...errorResponseSchema
    }
  }
};

export const putSchemaDoc = {
  description: 'Adiciona tabelas e relacionamentos ao schema existente de forma incremental. Tabelas com mesmo nome serão substituídas.',
  tags: ['schema'],
  summary: 'Atualizar schema incrementalmente',
  body: schemaUpdateSchema,
  response: {
    200: {
      description: 'Schema atualizado com sucesso',
      ...schemaUpdateResponseSchema
    },
    400: {
      description: 'Erro de validação - nenhuma tabela ou relacionamento fornecido',
      ...errorResponseSchema
    },
    404: {
      description: 'Schema não configurado - é necessário criar um schema inicial primeiro',
      ...errorResponseSchema
    },
    500: {
      description: 'Erro interno do servidor',
      ...errorResponseSchema
    }
  }
};

export const getSchemaDoc = {
  description: 'Retorna o schema atual configurado no sistema',
  tags: ['schema'],
  summary: 'Obter schema atual',
  response: {
    200: {
      description: 'Schema encontrado',
      ...schemaGetResponseSchema
    },
    404: {
      description: 'Schema não configurado',
      ...errorResponseSchema
    }
  }
};

export const deleteSchemaDoc = {
  description: 'Remove o schema configurado do sistema',
  tags: ['schema'],
  summary: 'Remover schema',
  response: {
    200: {
      description: 'Schema removido com sucesso',
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


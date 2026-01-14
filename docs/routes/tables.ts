import {
  tablesListResponseSchema,
  errorResponseSchema
} from '../schemas/database.js';

export const getTablesListDoc = {
  description: 'Retorna apenas o nome e a descrição de todas as tabelas do schema',
  tags: ['schema'],
  summary: 'Obter lista de tabelas',
  response: {
    200: {
      description: 'Lista de tabelas retornada com sucesso',
      ...tablesListResponseSchema
    },
    404: {
      description: 'Schema não configurado',
      ...errorResponseSchema
    }
  }
};

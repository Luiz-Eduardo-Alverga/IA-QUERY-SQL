import {
  queryRequestSchema,
  queryResponseSchema
} from '../schemas/query.js';
import { errorResponseSchema } from '../schemas/database.js';

export const postQueryDoc = {
  description: 'Gera uma consulta SQL a partir de uma pergunta em linguagem natural usando Inteligência Artificial (Google Gemini). O schema do banco de dados deve estar configurado previamente.',
  tags: ['query'],
  summary: 'Gerar SQL a partir de linguagem natural',
  body: queryRequestSchema,
  response: {
    200: {
      description: 'SQL gerado com sucesso',
      ...queryResponseSchema
    },
    400: {
      description: 'Erro ao gerar SQL ou validação - verifique se o schema está configurado e se a pergunta foi fornecida',
      ...errorResponseSchema
    }
  }
};


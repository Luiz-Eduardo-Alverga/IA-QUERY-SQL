import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SchemaManager } from '../services/schema-manager.js';
import { AIService } from '../services/ai-service.js';
import { DatabaseSchema } from '../types/database.js';

export default async function schemaRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const schemaManager = new SchemaManager();
  const aiService = fastify.aiService as AIService;

  // Carregar schema ao iniciar
  await schemaManager.loadSchema();
  const existingSchema = schemaManager.getSchema();
  if (existingSchema) {
    aiService.setSchema(existingSchema);
    fastify.log.info('Schema carregado do arquivo');
  }

  // POST /api/schema - Configurar/atualizar schema
  fastify.post<{ Body: DatabaseSchema }>('/api/schema', async (request, reply) => {
    try {
      // Validação básica
      console.log(request.body);
      if (!request.body.databaseName || !request.body.tables || request.body.tables.length === 0) {
        reply.code(400);
        return { 
          success: false, 
          error: 'Schema inválido. É necessário fornecer databaseName e pelo menos uma tabela.' 
        };
      }

      await schemaManager.saveSchema(request.body);
      aiService.setSchema(request.body);
      
      fastify.log.info(`Schema configurado: ${request.body.databaseName} com ${request.body.tables.length} tabelas`);
      
      return { 
        success: true, 
        message: 'Schema configurado com sucesso',
        databaseName: request.body.databaseName,
        tablesCount: request.body.tables.length
      };
    } catch (error: any) {
      fastify.log.error('Erro ao salvar schema:', error);
      reply.code(500);
      return { success: false, error: error.message || 'Erro ao salvar schema' };
    }
  });

  // GET /api/schema - Obter schema atual
  fastify.get('/api/schema', async (_request, reply) => {
    const schema = schemaManager.getSchema();
    if (!schema) {
      reply.code(404);
      return { success: false, message: 'Schema não configurado' };
    }
    return { success: true, schema };
  });

  // DELETE /api/schema - Limpar schema
  fastify.delete('/api/schema', async (_request, reply) => {
    try {
      schemaManager.clearSchema();
      // Criar um novo serviço sem schema (não podemos limpar diretamente)
      // O schema será limpo quando um novo for configurado
      return { success: true, message: 'Schema removido com sucesso' };
    } catch (error: any) {
      reply.code(500);
      return { success: false, error: error.message || 'Erro ao remover schema' };
    }
  });
}


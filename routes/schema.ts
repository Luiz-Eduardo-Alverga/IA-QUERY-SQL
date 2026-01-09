import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SchemaManager } from '../services/schema-manager.js';
import { AIService } from '../services/ai-service.js';
import { DatabaseSchema, SchemaUpdate } from '../types/database.js';
import {
  postSchemaDoc,
  putSchemaDoc,
  getSchemaDoc,
  deleteSchemaDoc
} from '../docs/routes/schema.js';

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
  fastify.post<{ Body: DatabaseSchema }>('/api/schema', {
    schema: postSchemaDoc
  }, async (request, reply) => {
    try {
      // Validação básica
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

  // PUT /api/schema - Adicionar tabelas e relacionamentos ao schema existente
  fastify.put<{ Body: SchemaUpdate }>('/api/schema', {
    schema: putSchemaDoc
  }, async (request, reply) => {
    try {
      const currentSchema = schemaManager.getSchema();
      
      if (!currentSchema) {
        reply.code(404);
        return { 
          success: false, 
          error: 'Schema não configurado. Use POST /api/schema para criar um schema inicial.' 
        };
      }

      // Validar que há algo para adicionar
      if ((!request.body.tables || request.body.tables.length === 0) && 
          (!request.body.relationships || request.body.relationships.length === 0)) {
        reply.code(400);
        return { 
          success: false, 
          error: 'É necessário fornecer pelo menos uma tabela ou relacionamento para adicionar.' 
        };
      }

      // Criar cópia do schema atual
      const updatedSchema: DatabaseSchema = {
        ...currentSchema,
        tables: [...currentSchema.tables],
        relationships: currentSchema.relationships ? [...currentSchema.relationships] : []
      };

      // Garantir que relationships sempre seja um array
      if (!updatedSchema.relationships) {
        updatedSchema.relationships = [];
      }

      // Adicionar novas tabelas (evitar duplicatas por nome)
      if (request.body.tables && request.body.tables.length > 0) {
        const existingTableNames = new Set(updatedSchema.tables.map(t => t.name));
        
        for (const newTable of request.body.tables) {
          if (existingTableNames.has(newTable.name)) {
            fastify.log.warn(`Tabela "${newTable.name}" já existe. Substituindo...`);
            // Substituir tabela existente
            const index = updatedSchema.tables.findIndex(t => t.name === newTable.name);
            updatedSchema.tables[index] = newTable;
          } else {
            updatedSchema.tables.push(newTable);
          }
        }
      }

      // Adicionar novos relacionamentos (evitar duplicatas)
      if (request.body.relationships && request.body.relationships.length > 0) {
        const existingRelationships = new Set(
          updatedSchema.relationships.map(r => 
            `${r.from.table}.${r.from.column}->${r.to.table}.${r.to.column}`
          )
        );

        for (const newRel of request.body.relationships) {
          const relKey = `${newRel.from.table}.${newRel.from.column}->${newRel.to.table}.${newRel.to.column}`;
          
          if (existingRelationships.has(relKey)) {
            fastify.log.warn(`Relacionamento "${relKey}" já existe. Ignorando...`);
          } else {
            updatedSchema.relationships.push(newRel);
          }
        }
      }

      // Salvar schema atualizado
      await schemaManager.saveSchema(updatedSchema);
      aiService.setSchema(updatedSchema);
      
      const addedTables = request.body.tables?.length || 0;
      const addedRelationships = request.body.relationships?.length || 0;
      
      fastify.log.info(`Schema atualizado: ${addedTables} tabela(s) e ${addedRelationships} relacionamento(s) adicionados`);
      
      return { 
        success: true, 
        message: 'Schema atualizado com sucesso',
        databaseName: updatedSchema.databaseName,
        totalTables: updatedSchema.tables.length,
        totalRelationships: updatedSchema.relationships?.length || 0,
        addedTables,
        addedRelationships
      };
    } catch (error: any) {
      fastify.log.error('Erro ao atualizar schema:', error);
      reply.code(500);
      return { success: false, error: error.message || 'Erro ao atualizar schema' };
    }
  });

  // GET /api/schema - Obter schema atual
  fastify.get('/api/schema', {
    schema: getSchemaDoc
  }, async (_request, reply) => {
    const schema = schemaManager.getSchema();
    if (!schema) {
      reply.code(404);
      return { success: false, message: 'Schema não configurado' };
    }
    return { success: true, schema };
  });

  // DELETE /api/schema - Limpar schema
  fastify.delete('/api/schema', {
    schema: deleteSchemaDoc
  }, async (_request, reply) => {
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


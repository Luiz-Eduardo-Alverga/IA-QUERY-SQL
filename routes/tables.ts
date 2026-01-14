import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { SchemaManager } from '../services/schema-manager.js';
import { getTablesListDoc } from '../docs/routes/tables.js';

export default async function tablesRoutes(
  fastify: FastifyInstance,
  _options: FastifyPluginOptions
): Promise<void> {
  const schemaManager = new SchemaManager();

  // GET /api/schema/tables - Obter lista de tabelas (nome e descrição)
  fastify.get('/api/schema/tables', {
    schema: getTablesListDoc
  }, async (_request, reply) => {
    // Carregar schema se necessário
    const schema = schemaManager.getSchema() || await schemaManager.loadSchema();
    
    if (!schema) {
      reply.code(404);
      return { success: false, error: 'Schema não configurado' };
    }

    const tables = schema.tables.map(table => ({
      name: table.name,
      description: table.description || null
    }));

    return {
      success: true,
      tables,
      count: tables.length
    };
  });
}

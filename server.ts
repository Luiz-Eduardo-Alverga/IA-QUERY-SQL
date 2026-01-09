import 'dotenv/config'; 
import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import indexRoutes from './routes/index.js';
import healthRoutes from './routes/health.js';
import schemaRoutes from './routes/schema.js';
import queryRoutes from './routes/query.js';
import { AIService } from './services/ai-service.js';

// Declarar tipo para decorator
declare module 'fastify' {
  interface FastifyInstance {
    aiService: AIService;
  }
}

const fastify: FastifyInstance = Fastify({
  logger: true
});

// Iniciar o servidor
const start = async (): Promise<void> => {
  try {
    // Configurar Swagger
    await fastify.register(swagger, {
      openapi: {
        info: {
          title: 'API Gerador de SQL com IA',
          description: 'API para gerar consultas SQL a partir de linguagem natural usando Google Gemini. Configure o schema do banco de dados e faça perguntas em português para obter SQL gerado automaticamente.',
          version: '1.0.0',
          contact: {
            name: 'API Support'
          }
        },
        servers: [
          {
            url: 'http://localhost:3000',
            description: 'Servidor de desenvolvimento'
          }
        ],
        tags: [
          { 
            name: 'schema', 
            description: 'Gerenciamento de schema do banco de dados. Configure tabelas, colunas e relacionamentos.' 
          },
          { 
            name: 'query', 
            description: 'Geração de SQL a partir de linguagem natural usando Inteligência Artificial.' 
          },
          { 
            name: 'health', 
            description: 'Verificação de saúde e status da API.' 
          }
        ]
      }
    });

    // Configurar Swagger UI
    await fastify.register(swaggerUi, {
      routePrefix: '/docs',
      uiConfig: {
        docExpansion: 'list',
        deepLinking: false,
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      uiHooks: {
        onRequest: function (_request, _reply, next) { next() },
        preHandler: function (_request, _reply, next) { next() }
      }
    });

    // Configurar CORS
    await fastify.register(cors, {
      origin: true, // Permite todas as origens (desenvolvimento)
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    });

    // Inicializar serviço de IA (Gemini)
    const geminiApiKey = process.env.GEMINI_API_KEY || '';
    const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    if (!geminiApiKey) {
      console.warn('⚠️  GEMINI_API_KEY não configurada. Configure a variável de ambiente.');
      console.warn('   O servidor iniciará, mas as funcionalidades de IA não funcionarão.');
    }

    let aiService: AIService;
    try {
      aiService = new AIService(geminiApiKey, geminiModel);
      fastify.decorate('aiService', aiService);
      fastify.log.info(`Gemini configurado com o modelo: ${geminiModel}`);
    } catch (error: any) {
      console.error('❌ Erro ao inicializar serviço de IA:', error.message);
      // Criar um serviço mock para não quebrar o servidor
      aiService = {} as AIService;
      fastify.decorate('aiService', aiService);
    }

    // Registrar rotas
    await fastify.register(indexRoutes);
    await fastify.register(healthRoutes);
    await fastify.register(schemaRoutes);
    await fastify.register(queryRoutes);

    await fastify.listen({ 
      port: 3001,
      host: '0.0.0.0'
    });
    
    console.log('🚀 Servidor Fastify rodando em http://localhost:3000');
    console.log('📚 Documentação Swagger disponível em http://localhost:3000/docs');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();


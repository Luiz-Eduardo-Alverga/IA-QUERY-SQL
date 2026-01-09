import 'dotenv/config'; 
import Fastify, { FastifyInstance } from 'fastify';
import indexRoutes from './routes/index.js';
import healthRoutes from './routes/health.js';
// import schemaRoutes from './routes/schema.js';
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
fastify.register(indexRoutes);
fastify.register(healthRoutes);
// fastify.register(schemaRoutes);
fastify.register(queryRoutes);

// Iniciar o servidor
const start = async (): Promise<void> => {
  try {
    await fastify.listen({ 
      port: 3000,
      host: '0.0.0.0'
    });
    console.log('🚀 Servidor Fastify rodando em http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();


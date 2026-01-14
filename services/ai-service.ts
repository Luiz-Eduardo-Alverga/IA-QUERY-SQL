import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { DatabaseSchema, QueryRequest, QueryResponse } from '../types/database.js';
import { buildPrompt, getSchemaStats } from '../prompts/sql-generator.js';
import { MetricsService } from './metrics-service.js';

export class AIService {
  private client: GoogleGenerativeAI;
  private modelName: string;
  private generationConfig: GenerationConfig;
  private schema: DatabaseSchema | null = null;
  private metricsService: MetricsService;

  constructor(apiKey: string, modelName = 'gemini-1.5-flash', metricsService?: MetricsService) {
    if (!apiKey) {
      throw new Error('API Key do Gemini não fornecida');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.generationConfig = {
      temperature: 0.1,
      responseMimeType: 'application/json'
    };
    this.metricsService = metricsService || new MetricsService();
  }

  getMetricsService(): MetricsService {
    return this.metricsService;
  }

  setSchema(schema: DatabaseSchema | null): void {
    this.schema = schema;
  }

  getSchema(): DatabaseSchema | null {
    return this.schema;
  }

  async generateSQL(request: QueryRequest): Promise<QueryResponse> {
    if (!this.schema) {
      throw new Error('Schema do banco de dados não configurado. Configure o schema primeiro via POST /api/schema');
    }

    const prompt = buildPrompt(this.schema, request.question, request.context);
    const schemaStats = getSchemaStats(this.schema);
    const startTime = Date.now();

    try {
      const model = this.client.getGenerativeModel({
        model: this.modelName,
        generationConfig: this.generationConfig,
        systemInstruction:
          'Você é um especialista em SQL. Gere apenas consultas SQL válidas baseadas no schema fornecido. Retorne SEMPRE um JSON com os campos: sql, explanation, confidence. Retorne a explanation em português.'
      });

      const result = await model.generateContent([
        { text: prompt }
      ]);

      const content = result.response.text();
      if (!content) {
        throw new Error('Resposta vazia da API');
      }

      const response = JSON.parse(content);

      if (!response.sql) {
        throw new Error('Resposta da IA não contém SQL válido');
      }

      const duration = Date.now() - startTime;
      const sqlResponse = {
        sql: String(response.sql).trim(),
        explanation: response.explanation || 'SQL gerado com sucesso',
        confidence: response.confidence || 0.8
      };

      // Registrar métrica de sucesso
      this.metricsService.recordMetric({
        timestamp: new Date(),
        duration,
        promptSize: prompt.length,
        schemaTables: schemaStats.tables,
        schemaColumns: schemaStats.columns,
        schemaRelationships: schemaStats.relationships,
        confidence: sqlResponse.confidence,
        success: true
      });

      return sqlResponse;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      
      // Registrar métrica de erro
      this.metricsService.recordMetric({
        timestamp: new Date(),
        duration,
        promptSize: prompt.length,
        schemaTables: schemaStats.tables,
        schemaColumns: schemaStats.columns,
        schemaRelationships: schemaStats.relationships,
        confidence: 0,
        success: false,
        error: error.message
      });

      if (error instanceof SyntaxError) {
        throw new Error('Erro ao processar resposta da IA: formato JSON inválido');
      }
      throw new Error(`Erro ao gerar SQL: ${error.message}`);
    }
  }
}


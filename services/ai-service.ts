import { GoogleGenerativeAI, GenerationConfig } from '@google/generative-ai';
import { DatabaseSchema, QueryRequest, QueryResponse } from '../types/database.js';
import { buildPrompt } from '../prompts/sql-generator.js';

export class AIService {
  private client: GoogleGenerativeAI;
  private modelName: string;
  private generationConfig: GenerationConfig;
  private schema: DatabaseSchema | null = null;

  constructor(apiKey: string, modelName = 'gemini-1.5-flash') {
    if (!apiKey) {
      throw new Error('API Key do Gemini não fornecida');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.modelName = modelName;
    this.generationConfig = {
      temperature: 0.1,
      responseMimeType: 'application/json'
    };
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

      return {
        sql: String(response.sql).trim(),
        explanation: response.explanation || 'SQL gerado com sucesso',
        confidence: response.confidence || 0.8
      };
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new Error('Erro ao processar resposta da IA: formato JSON inválido');
      }
      throw new Error(`Erro ao gerar SQL: ${error.message}`);
    }
  }
}


export interface QueryMetrics {
  timestamp: Date;
  duration: number; // ms
  promptSize: number; // caracteres
  schemaTables: number;
  schemaColumns: number;
  schemaRelationships: number;
  confidence: number;
  success: boolean;
  error?: string;
}

export interface AggregatedMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageLatency: number; // ms
  averageConfidence: number;
  averagePromptSize: number;
  averageSchemaTables: number;
  averageSchemaColumns: number;
  averageSchemaRelationships: number;
  minLatency: number;
  maxLatency: number;
  minConfidence: number;
  maxConfidence: number;
  errorRate: number; // porcentagem
  recentMetrics: QueryMetrics[]; // últimas 50 requisições
}

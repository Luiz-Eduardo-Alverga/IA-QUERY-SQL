export const queryMetricsSchema = {
  type: 'object',
  properties: {
    timestamp: { type: 'string', format: 'date-time' },
    duration: { type: 'number' },
    promptSize: { type: 'number' },
    schemaTables: { type: 'number' },
    schemaColumns: { type: 'number' },
    schemaRelationships: { type: 'number' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    success: { type: 'boolean' },
    error: { type: 'string' }
  }
};

export const aggregatedMetricsSchema = {
  type: 'object',
  properties: {
    totalRequests: { type: 'number' },
    successfulRequests: { type: 'number' },
    failedRequests: { type: 'number' },
    averageLatency: { type: 'number' },
    averageConfidence: { type: 'number' },
    averagePromptSize: { type: 'number' },
    averageSchemaTables: { type: 'number' },
    averageSchemaColumns: { type: 'number' },
    averageSchemaRelationships: { type: 'number' },
    minLatency: { type: 'number' },
    maxLatency: { type: 'number' },
    minConfidence: { type: 'number' },
    maxConfidence: { type: 'number' },
    errorRate: { type: 'number' },
    recentMetrics: {
      type: 'array',
      items: queryMetricsSchema
    }
  }
};

export const metricsResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    metrics: aggregatedMetricsSchema
  }
};

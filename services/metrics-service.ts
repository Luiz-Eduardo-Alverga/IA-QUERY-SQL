import { QueryMetrics, AggregatedMetrics } from '../types/metrics.js';

export class MetricsService {
  private metrics: QueryMetrics[] = [];
  private readonly MAX_HISTORY = 100;

  recordMetric(metric: QueryMetrics): void {
    this.metrics.push(metric);
    
    // Manter apenas últimas N requisições em memória
    if (this.metrics.length > this.MAX_HISTORY) {
      this.metrics.shift();
    }
  }

  getAggregatedMetrics(): AggregatedMetrics {
    if (this.metrics.length === 0) {
      return this.getEmptyMetrics();
    }

    const successful = this.metrics.filter(m => m.success);
    const failed = this.metrics.filter(m => !m.success);

    const latencies = this.metrics.map(m => m.duration);
    const confidences = successful.map(m => m.confidence);
    const promptSizes = this.metrics.map(m => m.promptSize);
    const schemaTables = this.metrics.map(m => m.schemaTables);
    const schemaColumns = this.metrics.map(m => m.schemaColumns);
    const schemaRelationships = this.metrics.map(m => m.schemaRelationships);

    return {
      totalRequests: this.metrics.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
      averageLatency: this.average(latencies),
      averageConfidence: confidences.length > 0 ? this.average(confidences) : 0,
      averagePromptSize: this.average(promptSizes),
      averageSchemaTables: this.average(schemaTables),
      averageSchemaColumns: this.average(schemaColumns),
      averageSchemaRelationships: this.average(schemaRelationships),
      minLatency: Math.min(...latencies),
      maxLatency: Math.max(...latencies),
      minConfidence: confidences.length > 0 ? Math.min(...confidences) : 0,
      maxConfidence: confidences.length > 0 ? Math.max(...confidences) : 0,
      errorRate: (failed.length / this.metrics.length) * 100,
      recentMetrics: this.metrics.slice(-50).reverse() // Últimas 50, mais recentes primeiro
    };
  }

  private average(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private getEmptyMetrics(): AggregatedMetrics {
    return {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageLatency: 0,
      averageConfidence: 0,
      averagePromptSize: 0,
      averageSchemaTables: 0,
      averageSchemaColumns: 0,
      averageSchemaRelationships: 0,
      minLatency: 0,
      maxLatency: 0,
      minConfidence: 0,
      maxConfidence: 0,
      errorRate: 0,
      recentMetrics: []
    };
  }

  clearMetrics(): void {
    this.metrics = [];
  }
}

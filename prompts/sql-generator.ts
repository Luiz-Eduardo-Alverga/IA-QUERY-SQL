import { DatabaseSchema } from '../types/database.js';

export function buildPrompt(
  schema: DatabaseSchema,
  question: string,
  context?: string
): string {
  const schemaDescription = formatSchema(schema);
  
  return `
Você é um especialista em SQL. Com base no schema do banco de dados abaixo, gere uma consulta SQL que responda à pergunta do usuário.

SCHEMA DO BANCO DE DADOS:
${schemaDescription}

${context ? `CONTEXTO ADICIONAL: ${context}\n` : ''}

PERGUNTA DO USUÁRIO: ${question}

INSTRUÇÕES:
1. Gere apenas SQL válido e otimizado.
2. Use os nomes exatos das tabelas e colunas do schema.
3. Inclua JOINs quando necessário.
4. Para filtrar produtos ativados/desativados, utilize a coluna produto.desativado.
5. Utilize a coluna produto_empresa_grade.ativo apenas se o usuário especificar que os produtos são grade.
6. Para buscas ou exibições de data de venda, utilize SEMPRE a lógica COALESCE(venda.api_data_hora_venda, venda.created_at). Isso garante que, se a data da API estiver nula, a data de criação seja utilizada como fallback. Aplique isso tanto no SELECT quanto nos filtros de WHERE.
7. O campo responsável por definir se o produto é combo, é o campo produto.habilitar_acompanhamento.
8. Sempre que o usuário solicitar Notas Fiscais, utilize o critério nota_fiscal_eletronica.modelo = 55
9. Sempre que o usuário solicitar Cupons Fiscais, utilize o critério nota_fiscal_eletronica.modelo = 65.
10. Retorne a resposta no formato JSON:
{
  "sql": "SELECT ...",
  "explanation": "Explicação da query",
  "confidence": 0.95
}
  11. CONSIDERAÇÃO DE PAGAMENTO: Um pagamento só deve ser considerado concluído (baixado) quando existirem dados correspondentes na tabela 'financeiro_parcela_pagamento'. Para relatórios de valores efetivamente recebidos ou pagos, realize o JOIN entre 'financeiro_parcela' e 'financeiro_parcela_pagamento'.

SQL:
`.trim();
}

function formatSchema(schema: DatabaseSchema): string {
  let formatted = `Banco de Dados: ${schema.databaseName}\n\n`;
  
  schema.tables.forEach(table => {
    formatted += `Tabela: ${table.name}\n`;
    if (table.description) {
      formatted += `Descrição: ${table.description}\n`;
    }
    formatted += `Colunas:\n`;
    table.columns.forEach(col => {
      formatted += `  - ${col.name} (${col.type})`;
      if (col.primaryKey) formatted += ' [PRIMARY KEY]';
      if (col.nullable) formatted += ' [NULLABLE]';
      if (col.foreignKey) {
        formatted += ` [FK -> ${col.foreignKey.table}.${col.foreignKey.column}]`;
      }
      formatted += '\n';
    });
    formatted += '\n';
  });

  if (schema.relationships && schema.relationships.length > 0) {
    formatted += 'Relacionamentos:\n';
    schema.relationships.forEach(rel => {
      formatted += `  ${rel.from.table}.${rel.from.column} -> ${rel.to.table}.${rel.to.column} (${rel.type})\n`;
    });
  }

  return formatted;
}

export function getSchemaStats(schema: DatabaseSchema): {
  tables: number;
  columns: number;
  relationships: number;
  promptSize: number;
} {
  const tables = schema.tables.length;
  const columns = schema.tables.reduce((sum, table) => sum + table.columns.length, 0);
  const relationships = schema.relationships?.length || 0;
  
  // Calcular tamanho aproximado do prompt formatado
  const formatted = formatSchema(schema);
  const promptSize = formatted.length;
  
  return {
    tables,
    columns,
    relationships,
    promptSize
  };
}
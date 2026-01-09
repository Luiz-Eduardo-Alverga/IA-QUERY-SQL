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
4. Para filtrar de produtos ativados/desativados, utilize a coluna produto.desativado.
5. Utilize a  coluna produto_empresa_grade.ativo apenas se o usuário especificar que os produtos são grade.
6. Retorne a explanation em português.
7. Retorne a resposta no formato JSON:
{
  "sql": "SELECT ...",
  "explanation": "Explicação da query",
  "confidence": 0.95
}

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


// 4. FORMATAÇÃO OBRIGATÓRIA: 
//    - Use quebras de linha entre as cláusulas (SELECT, FROM, JOIN, WHERE, etc).
//    - Indente as colunas no SELECT e sub-cláusulas.
//    - Use aliases curtos e significativos para as tabelas.
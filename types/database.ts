export interface TableColumn {
  name: string;
  type: string;
  nullable?: boolean;
  primaryKey?: boolean;
  foreignKey?: {
    table: string;
    column: string;
  };
}

export interface DatabaseTable {
  name: string;
  columns: TableColumn[];
  description?: string;
}

export interface DatabaseRelationship {
  from: { table: string; column: string };
  to: { table: string; column: string };
  type: 'one-to-one' | 'one-to-many' | 'many-to-many' | 'many-to-one';
}

export interface DatabaseSchema {
  databaseName: string;
  tables: DatabaseTable[];
  relationships?: DatabaseRelationship[];
}

export interface SchemaUpdate {
  tables?: DatabaseTable[];
  relationships?: DatabaseRelationship[];
}

export interface QueryRequest {
  question: string;
  context?: string; // Contexto adicional opcional
}

export interface QueryResponse {
  sql: string;
  explanation?: string;
  confidence?: number;
}


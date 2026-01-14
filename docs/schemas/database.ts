export const tableColumnSchema = {
  type: 'object',
  required: ['name', 'type'],
  properties: {
    name: {
      type: 'string',
      description: 'Nome da coluna'
    },
    type: {
      type: 'string',
      description: 'Tipo de dados da coluna (ex: INTEGER, VARCHAR(255), DECIMAL(10,2))'
    },
    nullable: {
      type: 'boolean',
      description: 'Indica se a coluna pode ser NULL'
    },
    primaryKey: {
      type: 'boolean',
      description: 'Indica se a coluna é chave primária'
    },
    foreignKey: {
      type: 'object',
      description: 'Informações sobre chave estrangeira',
      properties: {
        table: {
          type: 'string',
          description: 'Nome da tabela referenciada'
        },
        column: {
          type: 'string',
          description: 'Nome da coluna referenciada'
        }
      }
    }
  }
};

export const databaseTableSchema = {
  type: 'object',
  required: ['name', 'columns'],
  properties: {
    name: {
      type: 'string',
      description: 'Nome da tabela'
    },
    description: {
      type: 'string',
      description: 'Descrição da tabela'
    },
    columns: {
      type: 'array',
      description: 'Colunas da tabela',
      items: tableColumnSchema
    }
  }
};

export const relationshipSchema = {
  type: 'object',
  required: ['from', 'to', 'type'],
  properties: {
    from: {
      type: 'object',
      description: 'Origem do relacionamento',
      properties: {
        table: { type: 'string' },
        column: { type: 'string' }
      }
    },
    to: {
      type: 'object',
      description: 'Destino do relacionamento',
      properties: {
        table: { type: 'string' },
        column: { type: 'string' }
      }
    },
    type: {
      type: 'string',
      enum: ['one-to-one', 'one-to-many', 'many-to-one', 'many-to-many'],
      description: 'Tipo de relacionamento'
    }
  }
};

export const databaseSchemaSchema = {
  type: 'object',
  required: ['databaseName', 'tables'],
  properties: {
    databaseName: {
      type: 'string',
      description: 'Nome do banco de dados'
    },
    tables: {
      type: 'array',
      description: 'Lista de tabelas do banco de dados',
      items: databaseTableSchema
    },
    relationships: {
      type: 'array',
      description: 'Relacionamentos entre tabelas',
      items: relationshipSchema
    }
  }
};

export const schemaUpdateSchema = {
  type: 'object',
  properties: {
    tables: {
      type: 'array',
      description: 'Novas tabelas para adicionar ao schema existente',
      items: databaseTableSchema
    },
    relationships: {
      type: 'array',
      description: 'Novos relacionamentos para adicionar ao schema existente',
      items: relationshipSchema
    }
  }
};

export const schemaResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    databaseName: { type: 'string' },
    tablesCount: { type: 'number' }
  }
};

export const schemaUpdateResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    message: { type: 'string' },
    databaseName: { type: 'string' },
    totalTables: { type: 'number' },
    totalRelationships: { type: 'number' },
    addedTables: { type: 'number' },
    addedRelationships: { type: 'number' }
  }
};

export const schemaGetResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    schema: databaseSchemaSchema
  }
};

export const tableSummarySchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Nome da tabela'
    },
    description: {
      type: 'string',
      description: 'Descrição da tabela'
    }
  },
  required: ['name']
};

export const tablesListResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    tables: {
      type: 'array',
      description: 'Lista de tabelas com nome e descrição',
      items: tableSummarySchema
    },
    count: { type: 'number' }
  }
};

export const errorResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    error: { type: 'string' },
    message: { type: 'string' }
  }
};


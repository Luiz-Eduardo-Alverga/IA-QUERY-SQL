import { DatabaseSchema } from '../types/database.js';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { existsSync } from 'fs';

export class SchemaManager {
  private schemaPath: string;
  private schema: DatabaseSchema | null = null;

  constructor(schemaPath: string = './data/schema.json') {
    this.schemaPath = schemaPath;
  }

  async loadSchema(): Promise<DatabaseSchema | null> {
    try {
      if (!existsSync(this.schemaPath)) {
        return null;
      }
      const data = await readFile(this.schemaPath, 'utf-8');
      this.schema = JSON.parse(data);
      return this.schema;
    } catch (error) {
      console.error('Erro ao carregar schema:', error);
      return null;
    }
  }

  async saveSchema(schema: DatabaseSchema): Promise<void> {
    this.schema = schema;
    // Criar diretório se não existir
    const dir = dirname(this.schemaPath);
    if (!existsSync(dir)) {
      await mkdir(dir, { recursive: true });
    }
    await writeFile(this.schemaPath, JSON.stringify(schema, null, 2), 'utf-8');
  }

  getSchema(): DatabaseSchema | null {
    return this.schema;
  }

  clearSchema(): void {
    this.schema = null;
  }
}


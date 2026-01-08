# Projeto Fastify - Gerador de SQL com IA

Projeto Node.js utilizando o framework Fastify com TypeScript para gerar consultas SQL a partir de linguagem natural usando Inteligência Artificial.

## 🚀 Instalação

```bash
npm install
```

## ⚙️ Configuração (Google Gemini)

1. Copie o arquivo de exemplo de ambiente:
```bash
cp env.example .env
```

2. Configure sua API Key do Gemini no arquivo `.env`:
```env
GEMINI_API_KEY=your-gemini-api-key-here
GEMINI_MODEL=gemini-1.5-flash  # ou gemini-1.5-pro
```

Obtenha a chave em: https://aistudio.google.com/app/apikey

## ▶️ Executar

### Modo desenvolvimento (com watch)
```bash
npm run dev
```

### Build do projeto
```bash
npm run build
```

### Modo produção
```bash
npm start
```

### Verificar tipos TypeScript
```bash
npm run type-check
```

O servidor estará disponível em: `http://localhost:3000`

## 📝 Rotas Disponíveis

### Rotas Básicas
- `GET /` - Rota principal de boas-vindas
- `GET /health` - Health check do servidor

### API de Schema
- `POST /api/schema` - Configurar/atualizar schema do banco de dados
- `GET /api/schema` - Obter schema atual configurado
- `DELETE /api/schema` - Remover schema configurado

### API de Query
- `POST /api/query` - Gerar SQL a partir de linguagem natural

## 📖 Exemplos de Uso

### 1. Configurar Schema do Banco de Dados

```bash
POST http://localhost:3000/api/schema
Content-Type: application/json

{
  "databaseName": "ecommerce",
  "tables": [
    {
      "name": "users",
      "description": "Tabela de usuários do sistema",
      "columns": [
        { "name": "id", "type": "INTEGER", "primaryKey": true },
        { "name": "name", "type": "VARCHAR(255)" },
        { "name": "email", "type": "VARCHAR(255)" },
        { "name": "created_at", "type": "TIMESTAMP" }
      ]
    },
    {
      "name": "orders",
      "description": "Tabela de pedidos",
      "columns": [
        { "name": "id", "type": "INTEGER", "primaryKey": true },
        { "name": "user_id", "type": "INTEGER", "foreignKey": { "table": "users", "column": "id" } },
        { "name": "total", "type": "DECIMAL(10,2)" },
        { "name": "status", "type": "VARCHAR(50)" },
        { "name": "created_at", "type": "TIMESTAMP" }
      ]
    }
  ],
  "relationships": [
    {
      "from": { "table": "orders", "column": "user_id" },
      "to": { "table": "users", "column": "id" },
      "type": "many-to-one"
    }
  ]
}
```

### 2. Gerar SQL a partir de Linguagem Natural

```bash
POST http://localhost:3000/api/query
Content-Type: application/json

{
  "question": "Liste todos os usuários que fizeram pedidos acima de R$ 100"
}
```

**Resposta:**
```json
{
  "success": true,
  "sql": "SELECT DISTINCT u.* FROM users u INNER JOIN orders o ON u.id = o.user_id WHERE o.total > 100",
  "explanation": "Esta query retorna todos os usuários únicos que têm pelo menos um pedido com valor total maior que R$ 100, usando um JOIN entre as tabelas users e orders.",
  "confidence": 0.95,
  "generatedIn": "1234ms"
}
```

### 3. Obter Schema Atual

```bash
GET http://localhost:3000/api/schema
```

## 🛠️ Tecnologias

- **Fastify** - Framework web rápido e eficiente
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Google Gemini (1.5 Flash/Pro)** - Modelo de IA para geração de SQL
- **tsx** - Executor TypeScript para desenvolvimento

## 📁 Estrutura do Projeto

```
├── server.ts                 # Arquivo principal do servidor
├── routes/                   # Rotas da API
│   ├── index.ts             # Rota principal
│   ├── health.ts            # Health check
│   ├── schema.ts            # Gerenciamento de schema
│   └── query.ts             # Geração de SQL
├── services/                # Serviços de negócio
│   ├── ai-service.ts        # Serviço de integração com OpenAI
│   └── schema-manager.ts    # Gerenciamento de schema
├── types/                   # Tipos TypeScript
│   └── database.ts          # Tipos do banco de dados
├── prompts/                 # Templates de prompts
│   └── sql-generator.ts     # Prompt para geração de SQL
└── data/                    # Dados persistidos
    └── schema.json          # Schema salvo (gerado automaticamente)
```

## 🔧 Funcionalidades

- ✅ Configuração de schema do banco de dados
- ✅ Geração de SQL a partir de linguagem natural
- ✅ Suporte a relacionamentos entre tabelas
- ✅ Persistência de schema em arquivo
- ✅ Validação de entrada
- ✅ Logs detalhados
- ✅ Tratamento de erros

## 📚 Documentação

- Fastify: https://www.fastify.io/
- TypeScript: https://www.typescriptlang.org/
- OpenAI API: https://platform.openai.com/docs/

## ⚠️ Notas Importantes

- É necessário ter uma API Key válida do OpenAI para usar a funcionalidade de geração de SQL
- O schema é salvo automaticamente em `./data/schema.json`
- O modelo padrão é GPT-4 Turbo, mas pode ser alterado no código para GPT-3.5 Turbo (mais econômico)


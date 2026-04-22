# Agente IA para Consultas Analíticas em E-commerce

Aplicação full stack que permite fazer perguntas em linguagem natural sobre um banco SQLite de e-commerce e receber respostas analíticas em formato de chat.

## Visão geral

O projeto utiliza:

- **FastAPI** no backend
- **React + TypeScript + Vite + Tailwind CSS** no frontend
- **Gemini API** para geração de SQL
- **SQLite** como banco de dados
- **Streaming** para exibir a resposta no frontend em tempo real

---

## Funcionalidades

- perguntas em linguagem natural sobre dados de e-commerce
- geração automática de SQL com LLM
- reasoning estruturado para inspeção e debug
- validação de segurança com guardrails
- resposta em formato de chat com streaming
- histórico persistido no frontend
- separação entre rota de produção e rota de debug

---

## Estrutura do projeto

```bash
projeto_agente_IA/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── schemas.py
│   │   ├── schema_context.py
│   │   ├── schema_loader.py
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── banco.db
│   ├── generate_schema_cache.py
│   ├── requirements.txt
│   └── .env
└── frontend/
    ├── src/
    │  ├── components/
    │  ├── hooks/
    │  ├── types/
    │  ├── utils/
    │  ├── App.tsx
    │  ├── index.css
    │  └── main.tsx
    ├── package.json
    ├── pnpm-lock.yaml
    └── vite.config.ts
```

---

## Requisitos

Antes de começar, você precisa ter instalado:

- Python 3.11+
- Node.js 18+
- pnpm
- uma chave válida da Gemini API (obtida a partir do Google AI Studio)

---

## Configuração do backend

Entre na pasta do backend:

```bash
cd backend
```

### 1. Criar e ativar ambiente virtual

No Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate
```

### 2. Instalar dependências

```bash
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

Duplique o arquivo `.env.example` e renomeie para `.env` dentro de `backend/` e preencha o variável da chave de API.

```env
GEMINI_API_KEY=sua_chave_aqui
MODEL_NAME=gemini-2.5-flash-lite
```

### 4. Gerar o cache do schema

Esse passo é importante para que o sistema conheça a estrutura do banco antes de gerar SQL.

```bash
python generate_schema_cache.py
```

Esse script cria ou atualiza o arquivo de cache usado pelo contexto do agente.

### 5. Rodar o backend

```bash
uvicorn app.main:app --reload
```

O backend ficará disponível em:

```text
http://127.0.0.1:8000
```

O Swagger também está discponível, e fica em:
```text
http://127.0.0.1:8000/docs
```

---

## Configuração do frontend

Abra outro terminal e vá para a pasta do frontend:

```bash
cd frontend
```

### 1. Instalar dependências

```bash
pnpm install
```

### 2. Rodar o frontend

```bash
pnpm dev
```

O frontend ficará disponível em:

```text
http://127.0.0.1:5173
```

---

## Como usar

1. Inicie o backend.
2. Inicie o frontend.
3. Abra o navegador em `http://127.0.0.1:5173`.
4. Faça perguntas em linguagem natural, por exemplo:

- Quais são os 10 produtos mais vendidos?
- Qual é a receita total por categoria de produto?
- Qual é o percentual de pedidos entregues no prazo por estado?
- Quais vendedores têm a maior média de avaliação?

---

## Rotas principais

### Produção

- `GET /health`
- `POST /ask-stream`

A rota `/ask-stream` é a utilizada pelo frontend.

### Debug

- `POST /debug/ask`

Essa rota retorna:

- SQL gerada
- reasoning estruturado
- resultados
- summary

Ela é útil para testes técnicos e validação do comportamento do agente.

### Teste

- rotas em `/test/...`

Usadas para validações auxiliares durante o desenvolvimento.

---

## Fluxo geral da aplicação

1. O usuário envia uma pergunta em linguagem natural.
2. O backend monta o contexto do schema.
3. O modelo gera uma consulta SQL e um reasoning estruturado.
4. Os guardrails validam segurança e coerência.
5. A query é executada no SQLite.
6. Os resultados são formatados e enviados ao frontend.
7. O frontend exibe a resposta em formato de chat.

---

## Tecnologias utilizadas

### Backend

- FastAPI
- Pydantic
- SQLite
- Gemini API

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- pnpm

---

## Observações importantes

- o frontend usa apenas a rota de streaming
- a rota de debug existe para inspeção técnica
- o cache do schema deve ser regenerado se a estrutura do banco mudar
- a chave da Gemini API é obrigatória para geração de SQL

---

## Comandos resumidos

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python generate_schema_cache.py
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

---

## Melhorias futuras

- schema linking para reduzir contexto e custo de tokens
- melhorias adicionais nos guardrails
- melhorias de observabilidade
- refinamentos adicionais de UX

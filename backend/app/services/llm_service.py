import asyncio

from pydantic_ai import Agent
from pydantic_ai.models.google import GoogleModel
from pydantic_ai.providers.google import GoogleProvider
from pydantic_ai.settings import ModelSettings

from app.config import GEMINI_API_KEY, MODEL_NAME
from app.schema_context import SCHEMA_CONTEXT
from app.schemas import SQLGenerationResult


if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não encontrada no arquivo .env")


model = GoogleModel(
    MODEL_NAME,
    provider=GoogleProvider(api_key=GEMINI_API_KEY)
)

sql_agent = Agent(
    model=model,
    output_type=SQLGenerationResult,
    model_settings=ModelSettings(temperature=0.3),
    system_prompt=(
        "Você é um especialista em SQL analítico para SQLite. "
        "Sua única tarefa é converter perguntas em linguagem natural para consultas SQL corretas. "
        "Respeite estritamente o schema, os relacionamentos, os metadados de tabela e as regras fornecidas. "
        "Não invente tabelas, colunas, métricas ou filtros. "
        "Quando houver primary key e nome para a entidade analisada, agregue pela primary key e use o nome apenas para exibição. "
        "Interprete corretamente a métrica pedida: "
        "quantidade e volume = contagem; "
        "receita/faturamento/valor total = soma monetária; "
        "média = AVG; "
        "percentual = razão entre subconjunto e total. "
        "Além da SQL, explique o raciocínio analítico de forma clara e específica, citando entidade principal, métrica principal, tabelas utilizadas, relacionamentos, agregação e filtro ou critério de ordenação."
        "Gere apenas consultas de leitura."
    )
)



async def generate_sql(question: str) -> SQLGenerationResult:
    prompt = f"""
{SCHEMA_CONTEXT}

Pergunta do usuário:
{question}

Antes de gerar a SQL:
1. identifique a entidade principal da análise;
2. identifique a métrica principal pedida;
3. use a primary key da entidade para agregação quando ela existir (geralmente uma coluna de id);
4. use nomes apenas para exibição;
5. toda coluna calculada ou agregada no SELECT deve ter alias descritivo com AS;
6. preencha o campo reasoning com:
    - entidade_principal
    - metrica_principal
    - tabelas_utilizadas
    - relacionamentos_utilizados
    - agregação
    - filtro_ou_criterio
    - explicacao_final

Responda no formato estruturado esperado.
"""

    last_error = None

    for attempt in range(2):
        try:
            result = await sql_agent.run(prompt)
            return result.output
        except Exception as e:
            last_error = e
            message = str(e).lower()

            if "503" in message or "high demand" in message:
                await asyncio.sleep(2 * (attempt + 1))
                continue

            raise

    raise last_error
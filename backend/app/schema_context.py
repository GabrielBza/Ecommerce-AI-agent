import json
from pathlib import Path


SCHEMA_CACHE_PATH = Path(__file__).resolve().parent / "schema_cache.json"

BASE_INSTRUCTIONS = """
Você está gerando SQL para análise de dados de um e-commerce em SQLite.
"""

METRIC_HINTS = """
Semântica das métricas:
- contagem (exemplo: "quantidade", "mais vendidos", "ranking de produtos") = quantificação.
- solicitação que envolva dinheiro (exemplo: "receita", "faturamento", "valor total") = soma monetária.
- "média" = AVG.
- "percentual" ou "taxa" = subconjunto / total * 100.
"""

RELATIONSHIP_HINTS = """
Relacionamentos importantes:
- fat_itens_pedidos.id_produto -> dim_produtos.id_produto
- fat_itens_pedidos.id_vendedor -> dim_vendedores.id_vendedor
- fat_itens_pedidos.id_pedido -> fat_pedidos.id_pedido
- fat_pedidos.id_consumidor -> dim_consumidores.id_consumidor
- fat_pedido_total.id_consumidor -> dim_consumidores.id_consumidor
- fat_avaliacoes_pedidos.id_pedido -> fat_pedidos.id_pedido
"""

DOMAIN_HINTS = """
Semântica do domínio:
- fat_itens_pedidos representa os itens vendidos em cada pedido.
- dim_produtos contém nome_produto e categoria_produto.
- fat_pedido_total contém o valor total pago por pedido.
- fat_pedidos contém status do pedido e dados de entrega, mas não contém o estado do consumidor.
- fat_avaliacoes_pedidos contém a nota da avaliação.
- dim_consumidores contém cidade e estado do consumidor.
- dim_vendedores contém cidade e estado do vendedor.
- avaliações menores que 3 são consideradas negativas.
"""

ANALYTICAL_PATTERNS = """
Padrões analíticos importantes:
- Receita: use SUM(preco_BRL + preco_frete).
- Percentuais ou taxas: use SUM(CASE WHEN ...) / COUNT(*) * 100.
- Quando houver id e nome da mesma entidade, o GROUP BY deve usar o id.
- Rankings por quantidade devem usar contagem.
- Ticket médio usa soma dividida por contagem.
"""

RULES = """
Regras obrigatórias:
- Gere apenas consultas de leitura.
- Nunca use INSERT, UPDATE, DELETE, DROP, ALTER, CREATE, REPLACE, TRUNCATE, PRAGMA ou ATTACH.
- Use apenas tabelas e colunas existentes no banco, nunca invente elas.
- Quando uma análise envolver ranking, inclua também no resultado a métrica usada no ranking e o filtro utilizado (caso seja importante).
- Quando a tabela da entidade analisada possuir primary key, use essa primary key no GROUP BY.
- Agrupamentos de análise devem utilizar o identificador (id) da entidade, e não a coluna de nome.
- Use colunas de nome apenas para exibição, não como chave principal de agregação, quando houver identificador único disponível.
- Sempre que uma métrica ou atributo for o foco da análise, organize o resultado baseado nele (exemplo: quantidade, preço e status).
- Todas as colunas calculadas no SELECT devem ter alias descritivo usando AS.
- percentuais ou taxas que apresentarem resultado 0 também devem ser mostrados.
- No reasoning, descreva entidade e métrica em linguagem de negócio, e não apenas com nomes técnicos de tabela ou alias SQL.
- Sua resposta deve seguir exatamente o formato estruturado esperado:
  - sql: consulta SQL gerada
  - reasoning: explicação curta do raciocínio usado
"""


def load_schema_cache() -> dict:
    if not SCHEMA_CACHE_PATH.exists():
        return {"schema": {}, "distinct_values": {}}

    with open(SCHEMA_CACHE_PATH, "r", encoding="utf-8") as file:
        return json.load(file)


def format_schema(schema: dict[str, list[dict[str, str]]]) -> str:
    if not schema:
        return "Schema do banco: indisponível."

    lines = ["Schema do banco:"]

    for table_name, columns in schema.items():
        formatted_columns = ", ".join(
            f"{column['name']} {column['type']}"
            for column in columns
        )
        lines.append(f"- {table_name}({formatted_columns})")

    return "\n".join(lines)


def format_distinct_values(distinct_values: dict[str, dict[str, list[str]]]) -> str:
    if not distinct_values:
        return "Valores distintos relevantes: indisponíveis."

    lines = ["Valores distintos relevantes:"]

    for table_name, columns in distinct_values.items():
        lines.append(f"- {table_name}:")
        for column_name, values in columns.items():
            values_text = ", ".join(repr(value) for value in values)
            lines.append(f"  - {column_name}: {values_text}")

    return "\n".join(lines)


def format_table_metadata(table_metadata: dict[str, dict]) -> str:
    if not table_metadata:
        return "Metadados das tabelas: indisponíveis."

    lines = ["Metadados das tabelas:"]

    for table_name, metadata in table_metadata.items():
        primary_key = metadata.get("primary_key")
        grain = metadata.get("grain", "não informado")

        if primary_key:
            lines.append(f"- {table_name}: primary key = {primary_key}; granularidade = {grain}")
        else:
            lines.append(f"- {table_name}: primary key = não definida; granularidade = {grain}")

    return "\n".join(lines)


def build_schema_context() -> str:
    cache = load_schema_cache()
    schema = cache.get("schema", {})
    distinct_values = cache.get("distinct_values", {})
    table_metadata = cache.get("table_metadata", {})

    formatted_schema = format_schema(schema)
    formatted_distinct_values = format_distinct_values(distinct_values)
    formatted_table_metadata = format_table_metadata(table_metadata)

    return "\n\n".join([
        BASE_INSTRUCTIONS.strip(),
        formatted_schema,
        formatted_table_metadata,
        formatted_distinct_values,
        RELATIONSHIP_HINTS.strip(),
        DOMAIN_HINTS.strip(),
        ANALYTICAL_PATTERNS.strip(),
        RULES.strip()
    ])


SCHEMA_CONTEXT = build_schema_context()
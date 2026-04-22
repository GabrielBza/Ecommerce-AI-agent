import re


def validate_sql(query: str) -> None:
    cleaned_query = query.strip()
    upper_query = cleaned_query.upper()

    if not cleaned_query:
        raise ValueError("A consulta gerada está vazia.")

    forbidden_commands = [
        "INSERT",
        "UPDATE",
        "DELETE",
        "DROP",
        "ALTER",
        "TRUNCATE",
        "CREATE",
        "REPLACE",
        "PRAGMA",
        "ATTACH",
    ]

    if any(command in upper_query for command in forbidden_commands):
        raise ValueError("Somente consultas de leitura são permitidas.")

    if not (upper_query.startswith("SELECT") or upper_query.startswith("WITH")):
        raise ValueError("A consulta deve começar com SELECT ou WITH.")

    if ";" in cleaned_query[:-1]:
        raise ValueError("Múltiplas consultas não são permitidas.")


def validate_semantics(question: str, query: str) -> None:
    question_lower = question.lower()
    query_lower = query.lower()

    _validate_required_aliases(query_lower)
    _validate_product_aggregation(question_lower, query_lower)
    _validate_seller_aggregation(question_lower, query_lower)
    _validate_customer_aggregation(question_lower, query_lower)
    _validate_extreme_value_logic(question_lower, query_lower)


def _validate_required_aliases(query_lower: str) -> None:
    suspicious_patterns = ["count(", "sum(", "avg(", "cast(", "case when"]

    has_calculated_expression = any(pattern in query_lower for pattern in suspicious_patterns)
    has_alias = " as " in query_lower

    if has_calculated_expression and not has_alias:
        raise ValueError(
            "A consulta possui colunas calculadas ou agregadas sem alias descritivo."
        )


def _validate_product_aggregation(question_lower: str, query_lower: str) -> None:
    is_product_question = "produto" in question_lower or "produtos" in question_lower
    has_group_by = "group by" in query_lower

    if not is_product_question or not has_group_by:
        return

    groups_by_product_name_only = (
        ("group by t2.nome_produto" in query_lower or "group by nome_produto" in query_lower)
        and "id_produto" not in query_lower.split("group by", 1)[1]
    )

    if groups_by_product_name_only:
        raise ValueError("Produtos devem ser agregados pelo identificador do produto, e não apenas pelo nome.")


def _validate_seller_aggregation(question_lower: str, query_lower: str) -> None:
    is_seller_question = "vendedor" in question_lower or "vendedores" in question_lower
    has_group_by = "group by" in query_lower

    if not is_seller_question or not has_group_by:
        return

    groups_by_seller_name_only = (
        ("group by t2.nome_vendedor" in query_lower or "group by nome_vendedor" in query_lower)
        and "id_vendedor" not in query_lower.split("group by", 1)[1]
    )

    if groups_by_seller_name_only:
        raise ValueError("Vendedores devem ser agregados pelo identificador do vendedor, e não apenas pelo nome.")


def _validate_customer_aggregation(question_lower: str, query_lower: str) -> None:
    is_customer_question = "consumidor" in question_lower or "consumidores" in question_lower
    has_group_by = "group by" in query_lower

    if not is_customer_question or not has_group_by:
        return

    groups_by_customer_name_only = (
        ("group by t2.nome_consumidor" in query_lower or "group by nome_consumidor" in query_lower)
        and "id_consumidor" not in query_lower.split("group by", 1)[1]
    )

    if groups_by_customer_name_only:
        raise ValueError(
            "Consumidores não podem ser agregados apenas por nome_consumidor quando id_consumidor estiver disponível."
        )


def _validate_extreme_value_logic(question_lower: str, query_lower: str) -> None:
    asks_for_extreme_value = any(
        term in question_lower for term in ["maior", "melhor", "menor", "pior"]
    )
    asks_for_ranking = "top" in question_lower or "ranking" in question_lower

    if asks_for_extreme_value and not asks_for_ranking:
        uses_limit = bool(re.search(r"\blimit\s+\d+\b", query_lower))
        uses_extreme_filter = "max(" in query_lower or "min(" in query_lower

        if uses_limit and not uses_extreme_filter:
            raise ValueError("A pergunta pede um valor extremo, então a consulta deve filtrar pelo maior ou menor valor, e não apenas usar LIMIT.")
from typing import Any


def round_numeric_values(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    rounded_rows: list[dict[str, Any]] = []

    for row in rows:
        new_row: dict[str, Any] = {}

        for key, value in row.items():
            if isinstance(value, float):
                new_row[key] = round(value, 2)
            else:
                new_row[key] = value

        rounded_rows.append(new_row)

    return rounded_rows


def normalize_column_names(rows: list[dict[str, Any]]) -> list[dict[str, Any]]:
    normalized_rows: list[dict[str, Any]] = []

    for row in rows:
        new_row: dict[str, Any] = {}

        for key, value in row.items():
            normalized_key = key

            if "CASE WHEN" in key or "COUNT(" in key or "SUM(" in key or "CAST(" in key:
                if "entrega_no_prazo" in key:
                    normalized_key = "percentual_entregue_no_prazo"
                else:
                    normalized_key = "valor_calculado"

            new_row[normalized_key] = value

        normalized_rows.append(new_row)

    return normalized_rows


def build_summary(question: str, rows: list[dict[str, Any]]) -> str:
    if not rows:
        return "Nenhum resultado encontrado para a pergunta informada."

    first_row = rows[0]
    num_rows = len(rows)
    question_lower = question.lower()

    # Caso de resultado único
    if num_rows == 1:
        items = [f"{key}={value}" for key, value in first_row.items()]
        return f"Resultado encontrado: {', '.join(items)}."

    # Casos de ranking
    if any(term in question_lower for term in ["top", "mais", "maior", "melhor", "ranking"]):
        first_items = [f"{key}={value}" for key, value in first_row.items()]
        return f"A consulta retornou {num_rows} resultado(s). O primeiro resultado foi: {', '.join(first_items)}."

    # Casos gerais
    return f"A consulta retornou {num_rows} resultado(s)."
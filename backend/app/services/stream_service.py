import json
from typing import AsyncGenerator

from app.services.pipeline_service import (
    build_pipeline_summary,
    execute_and_format_query,
    generate_query_and_reasoning,
)


async def process_question_stream(question: str) -> AsyncGenerator[str, None]:
    yield json.dumps(
        {"type": "status", "message": "Entendendo sua pergunta..."},
        ensure_ascii=False
    ) + "\n"

    yield json.dumps(
        {"type": "status", "message": "Montando a consulta..."},
        ensure_ascii=False
    ) + "\n"

    generated = await generate_query_and_reasoning(question)

    yield json.dumps(
        {"type": "status", "message": "Buscando os dados..."},
        ensure_ascii=False
    ) + "\n"

    rows = execute_and_format_query(generated.sql)

    yield json.dumps(
        {"type": "status", "message": "Preparando a resposta final..."},
        ensure_ascii=False
    ) + "\n"

    summary = build_pipeline_summary(question, rows)

    yield json.dumps(
        {
            "type": "done",
            "question": question,
            "rows": rows,
            "summary": summary,
            "reasoning": generated.reasoning.model_dump(),
        },
        ensure_ascii=False
    ) + "\n"
from dataclasses import dataclass
from typing import Any

from app.database import execute_query
from app.services.guardrails import validate_sql, validate_semantics
from app.services.llm_service import generate_sql
from app.utils.formatter import (
    build_summary,
    normalize_column_names,
    round_numeric_values,
)


@dataclass
class PipelineResult:
    question: str
    sql: str
    reasoning: Any
    rows: list[dict[str, Any]]
    summary: str


@dataclass
class GeneratedQueryResult:
    sql: str
    reasoning: Any


async def generate_query_and_reasoning(question: str) -> GeneratedQueryResult:
    agent_result = await generate_sql(question)

    sql = agent_result.sql.strip()
    reasoning = agent_result.reasoning

    validate_sql(sql)
    validate_semantics(question, sql)

    return GeneratedQueryResult(sql=sql, reasoning=reasoning)


def execute_and_format_query(sql: str) -> list[dict[str, Any]]:
    rows = execute_query(sql)
    rows = normalize_column_names(rows)
    rows = round_numeric_values(rows)
    return rows


def build_pipeline_summary(question: str, rows: list[dict[str, Any]]) -> str:
    return build_summary(question, rows)


async def run_question_pipeline(question: str) -> PipelineResult:
    generated = await generate_query_and_reasoning(question)
    rows = execute_and_format_query(generated.sql)
    summary = build_pipeline_summary(question, rows)

    return PipelineResult(
        question=question,
        sql=generated.sql,
        reasoning=generated.reasoning,
        rows=rows,
        summary=summary,
    )
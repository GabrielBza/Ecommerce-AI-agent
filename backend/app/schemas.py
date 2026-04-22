from typing import Any
from pydantic import BaseModel, Field


class AskRequest(BaseModel):
    question: str = Field(..., min_length=1, description="Pergunta em linguagem natural")


class SQLReasoning(BaseModel):
    entidade_principal: str
    metrica_principal: str
    tabelas_utilizadas: list[str]
    relacionamentos_utilizados: list[str]
    agregacao: str
    filtro_ou_criterio: str
    explicacao_final: str


class AskResponse(BaseModel):
    question: str
    sql: str
    reasoning: SQLReasoning
    rows: list[dict[str, Any]]
    summary: str


class SQLGenerationResult(BaseModel):
    sql: str
    reasoning: SQLReasoning
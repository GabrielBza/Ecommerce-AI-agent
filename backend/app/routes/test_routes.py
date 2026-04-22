from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any

from app.database import execute_query
from app.services.guardrails import validate_sql

router = APIRouter(prefix="/test", tags=["Testes"])


class SQLQueryRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Consulta SQL de leitura")


class SQLQueryResponse(BaseModel):
    query: str
    rows: list[dict[str, Any]]
    row_count: int


@router.get("/db")
def test_db():
    query = "SELECT name FROM sqlite_master WHERE type='table';"
    rows = execute_query(query)
    return {"tables": rows}


@router.post("/run-sql", response_model=SQLQueryResponse)
def run_sql(request: SQLQueryRequest):
    try:
        validate_sql(request.query)
        rows = execute_query(request.query)

        return SQLQueryResponse(
            query=request.query,
            rows=rows,
            row_count=len(rows),
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
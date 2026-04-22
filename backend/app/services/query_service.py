from app.schemas import AskResponse
from app.services.pipeline_service import run_question_pipeline


async def process_question(question: str) -> AskResponse:
    result = await run_question_pipeline(question)

    return AskResponse(
        question=result.question,
        sql=result.sql,
        reasoning=result.reasoning,
        rows=result.rows,
        summary=result.summary,
    )
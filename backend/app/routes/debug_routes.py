from fastapi import APIRouter, HTTPException

from app.schemas import AskRequest, AskResponse
from app.services.query_service import process_question

router = APIRouter(prefix="/debug", tags=["debug"])


@router.post("/ask", response_model=AskResponse)
async def ask_debug(request: AskRequest):
    try:
        return await process_question(request.question)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        print("Erro interno em /debug/ask:", repr(e))
        raise HTTPException(
            status_code=500,
            detail={
                "message": "Erro técnico ao processar a pergunta.",
                "raw_error": repr(e),
                "error_type": type(e).__name__,
            },
        )
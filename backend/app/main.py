import json

from fastapi import FastAPI
from fastapi.responses import StreamingResponse

from app.routes.debug_routes import router as debug_router
from app.routes.test_routes import router as test_router
from app.schemas import AskRequest
from app.services.stream_service import process_question_stream
from app.utils.error_handler import map_exception_to_error

app = FastAPI(title="Agente IA E-commerce")

app.include_router(debug_router)
app.include_router(test_router)


@app.get("/")
def root():
    return {"message": "API funcionando!"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/ask-stream")
async def ask_stream(request: AskRequest):
    async def event_generator():
        try:
            async for chunk in process_question_stream(request.question):
                yield chunk

        except ValueError as e:
            yield json.dumps(
                {"type": "error", "message": str(e)},
                ensure_ascii=False
            ) + "\n"

        except Exception as e:
            print("Erro interno em /ask-stream:", repr(e))
            handled = map_exception_to_error(e)

            yield json.dumps(
                {"type": "error", "message": handled.message},
                ensure_ascii=False
            ) + "\n"

    return StreamingResponse(
        event_generator(),
        media_type="application/x-ndjson",
    )
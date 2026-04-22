from dataclasses import dataclass


@dataclass
class HandledError:
    status_code: int
    message: str


def map_exception_to_error(exc: Exception) -> HandledError:
    error_message = str(exc).lower()

    if "429" in error_message or "quota" in error_message or "resource_exhausted" in error_message:
        return HandledError(
            status_code=429,
            message="A cota da API do modelo foi excedida temporariamente. Aguarde um pouco antes de tentar novamente."
        )

    if "503" in error_message or "high demand" in error_message:
        return HandledError(
            status_code=503,
            message="O modelo está temporariamente indisponível por alta demanda. Tente novamente em instantes."
        )

    if (
        "syntax error" in error_message
        or "no such column" in error_message
        or "no such table" in error_message
        or "misuse of aggregate" in error_message
        or "ambiguous column" in error_message
        or "operationalerror" in error_message
    ):
        return HandledError(
            status_code=400,
            message="A consulta gerada não pôde ser executada corretamente no banco de dados."
        )

    return HandledError(
        status_code=500,
        message="Ocorreu um erro interno ao processar a pergunta."
    )
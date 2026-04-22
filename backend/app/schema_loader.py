import json
import sqlite3
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DB_PATH = BASE_DIR / "banco.db"
SCHEMA_CACHE_PATH = Path(__file__).resolve().parent / "schema_cache.json"

TABLE_METADATA = {
    "dim_consumidores": {
        "primary_key": "id_consumidor",
        "grain": "um registro por consumidor"
    },
    "dim_produtos": {
        "primary_key": "id_produto",
        "grain": "um registro por produto"
    },
    "dim_vendedores": {
        "primary_key": "id_vendedor",
        "grain": "um registro por vendedor"
    },
    "fat_pedidos": {
        "primary_key": "id_pedido",
        "grain": "um registro por pedido"
    },
    "fat_pedido_total": {
        "primary_key": "id_pedido",
        "grain": "um registro por pedido"
    },
    "fat_itens_pedidos": {
        "primary_key": None,
        "grain": "um registro por item de pedido"
    },
    "fat_avaliacoes_pedidos": {
        "primary_key": "id_avaliacao",
        "grain": "um registro por avaliação"
    }
}

IMPORTANT_DISTINCT_COLUMNS = {
    "fat_pedidos": ["status", "entrega_no_prazo"],
    "dim_consumidores": ["estado"],
    "dim_vendedores": ["estado"],
    "dim_produtos": ["categoria_produto"],
}




def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def extract_tables(cursor: sqlite3.Cursor) -> list[str]:
    cursor.execute("""
        SELECT name
        FROM sqlite_master
        WHERE type = 'table'
          AND name NOT LIKE 'sqlite_%'
        ORDER BY name;
    """)
    return [row["name"] for row in cursor.fetchall()]


def extract_schema(cursor: sqlite3.Cursor, tables: list[str]) -> dict[str, list[dict[str, str]]]:
    schema: dict[str, list[dict[str, str]]] = {}

    for table in tables:
        cursor.execute(f"PRAGMA table_info({table});")
        columns = cursor.fetchall()

        schema[table] = [
            {
                "name": column["name"],
                "type": column["type"] or "TEXT"
            }
            for column in columns
        ]

    return schema


def extract_distinct_values(cursor: sqlite3.Cursor) -> dict[str, dict[str, list[str]]]:
    distinct_values: dict[str, dict[str, list[str]]] = {}

    for table, columns in IMPORTANT_DISTINCT_COLUMNS.items():
        distinct_values[table] = {}

        for column in columns:
            query = f"""
                SELECT DISTINCT {column}
                FROM {table}
                WHERE {column} IS NOT NULL
                ORDER BY {column};
            """
            cursor.execute(query)
            rows = cursor.fetchall()

            distinct_values[table][column] = [str(row[column]) for row in rows]

    return distinct_values


def build_cache_payload() -> dict:
    conn = get_connection()

    try:
        cursor = conn.cursor()
        tables = extract_tables(cursor)
        schema = extract_schema(cursor, tables)
        distinct_values = extract_distinct_values(cursor)

        return {
            "schema": schema,
            "table_metadata": TABLE_METADATA,
            "distinct_values": distinct_values
        }
    finally:
        conn.close()


def save_schema_cache() -> dict:
    payload = build_cache_payload()

    with open(SCHEMA_CACHE_PATH, "w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2)

    return payload
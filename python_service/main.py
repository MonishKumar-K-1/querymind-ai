from pathlib import Path
import re
import sqlite3
import time
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DB_PATH = DATA_DIR / "querymind.db"
SCHEMA_FILE = BASE_DIR / "database.sql"
MAX_ROWS = 500
QUERY_TIMEOUT_SECONDS = 5

app = FastAPI(title="QueryMind SQL Engine", version="1.0.0")


def initialize_database():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(DB_PATH) as connection:
        connection.execute("PRAGMA foreign_keys = ON")
        if not connection.execute(
            "SELECT 1 FROM sqlite_master WHERE type='table' AND name='EMPLOYEE'"
        ).fetchone():
            connection.executescript(SCHEMA_FILE.read_text(encoding="utf-8"))
        connection.commit()


def readonly_connection():
    if not DB_PATH.exists():
        initialize_database()
    uri = f"file:{DB_PATH.as_posix()}?mode=ro"
    connection = sqlite3.connect(uri, uri=True, timeout=2)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA query_only = ON")
    return connection


def strip_leading_comments(sql: str) -> str:
    value = sql.strip()
    while True:
        updated = re.sub(r"^(?:\s|--[^\n]*(?:\n|$)|/\*.*?\*/)*", "", value, count=1, flags=re.S)
        if updated == value:
            return value
        value = updated


def validate_sql(sql: str):
    if not sql or not sql.strip():
        raise HTTPException(status_code=400, detail="SQL query is empty.")
    if len(sql) > 10000:
        raise HTTPException(status_code=400, detail="SQL query is too long.")

    normalized = strip_leading_comments(sql)
    if not re.match(r"^(SELECT|WITH)\b", normalized, flags=re.I):
        raise HTTPException(status_code=403, detail="Security restriction: only read-only SELECT queries are allowed.")

    # SQLite execute() rejects multiple statements. Remove one optional final semicolon for checking.
    if ";" in normalized.rstrip().rstrip(";"):
        raise HTTPException(status_code=403, detail="Multiple SQL statements are not allowed.")


ALLOWED_ACTIONS = {
    sqlite3.SQLITE_SELECT,
    sqlite3.SQLITE_READ,
    sqlite3.SQLITE_FUNCTION,
    getattr(sqlite3, "SQLITE_RECURSIVE", -1),
}


def authorizer(action, arg1, arg2, database_name, source):
    if action in ALLOWED_ACTIONS:
        if action == sqlite3.SQLITE_FUNCTION and (arg2 or arg1 or "").lower() in {
            "load_extension", "writefile", "readfile"
        }:
            return sqlite3.SQLITE_DENY
        return sqlite3.SQLITE_OK
    return sqlite3.SQLITE_DENY


class ExecuteRequest(BaseModel):
    sql: str = Field(min_length=1, max_length=10000)


@app.on_event("startup")
def startup():
    initialize_database()


@app.get("/health")
def health():
    return {"status": "ok", "service": "querymind-python-sql-engine"}


@app.get("/schema")
def schema():
    connection = readonly_connection()
    try:
        table_rows = connection.execute(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
        ).fetchall()
        tables = []
        total_records = 0
        for item in table_rows:
            table_name = item["name"]
            # Table names originate from sqlite_master, not from user input.
            columns = connection.execute(f'PRAGMA table_info("{table_name}")').fetchall()
            count = connection.execute(f'SELECT COUNT(*) AS count FROM "{table_name}"').fetchone()["count"]
            total_records += count
            tables.append({
                "name": table_name,
                "row_count": count,
                "columns": [
                    {
                        "name": column["name"],
                        "type": column["type"],
                        "primary_key": bool(column["pk"]),
                        "not_null": bool(column["notnull"]),
                    }
                    for column in columns
                ],
            })
        return {"tables": tables, "table_count": len(tables), "total_records": total_records}
    finally:
        connection.close()


@app.post("/execute")
def execute(request: ExecuteRequest):
    validate_sql(request.sql)
    connection = readonly_connection()
    started = time.perf_counter()
    deadline = started + QUERY_TIMEOUT_SECONDS

    def stop_long_query():
        return 1 if time.perf_counter() > deadline else 0

    try:
        connection.set_authorizer(authorizer)
        connection.set_progress_handler(stop_long_query, 10000)
        cursor = connection.cursor()
        cursor.execute(request.sql)
        if cursor.description is None:
            raise HTTPException(status_code=403, detail="Security restriction: only read-only SELECT queries are allowed.")

        columns = [description[0] for description in cursor.description]
        fetched = cursor.fetchmany(MAX_ROWS + 1)
        truncated = len(fetched) > MAX_ROWS
        fetched = fetched[:MAX_ROWS]
        rows = [dict(row) for row in fetched]
        elapsed = round((time.perf_counter() - started) * 1000, 2)
        return {
            "columns": columns,
            "rows": rows,
            "row_count": len(rows),
            "truncated": truncated,
            "execution_time_ms": elapsed,
        }
    except HTTPException:
        raise
    except sqlite3.OperationalError as error:
        message = str(error)
        if "interrupted" in message.lower():
            raise HTTPException(status_code=408, detail="Query exceeded the 5-second execution limit.")
        if "not authorized" in message.lower():
            raise HTTPException(status_code=403, detail="This SQL operation is not permitted.")
        raise HTTPException(status_code=400, detail=f"SQL execution error: {message}")
    except sqlite3.Error as error:
        raise HTTPException(status_code=400, detail=f"SQL execution error: {error}")
    finally:
        connection.close()

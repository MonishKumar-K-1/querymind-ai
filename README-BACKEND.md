# QueryMind AI — Backend

## Services
- React/Vite frontend: `http://localhost:5173`
- Node/Express API: `http://localhost:5000`
- Python/FastAPI SQL engine: `http://localhost:8000`
- SQLite file is created automatically at `python_service/data/querymind.db`.

## 1. Python SQL engine
Open a terminal:
```powershell
cd python_service
# Activate your existing virtual environment if you already created it:
.\venv\Scripts\Activate.ps1
# Install only if requirements are not installed:
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
The first startup creates the SQLite database and inserts assignment sample data.

## 2. Node API
Open another terminal:
```powershell
cd server
# Install only if the dependencies are not installed:
npm install
```
Copy `.env.example` to `.env` and add your Gemini API key:
```env
PORT=5000
GEMINI_API_KEY=your_actual_key
GEMINI_MODEL=gemini-2.5-flash
PYTHON_SERVICE_URL=http://127.0.0.1:8000
```
Then run:
```powershell
npm run dev
```

## 3. Frontend
Run the existing Vite frontend in a third terminal:
```powershell
npm run dev
```
Vite proxies `/api` requests to Node at port 5000. The supplied `vite.config.js` patch enables this.

## API
- `GET /api/health`
- `GET /api/schema`
- `POST /api/query` with `{ "question": "Show top customers by sales" }`

The Python engine uses a read-only SQLite connection, `PRAGMA query_only`, a SQLite authorizer, a 5-second execution timeout and a 500-row response cap. Do not expose the Python service directly to the public internet.

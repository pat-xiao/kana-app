# Kana App

A quiz API for learning Japanese hiragana and katakana, with a React frontend.

---

![Screenshot placeholder](docs/screenshot.png)

> _Screenshot coming soon._

---

## Tech Stack

- **Python 3.11+** — backend language
- **FastAPI** — REST API framework
- **Pydantic v2** — data validation and modelling
- **pytest** — backend test suite
- **React** — frontend UI
- **Vite** — frontend build tool and dev server

---

## Local Development

### Backend

```bash
git clone <repo-url>
cd kana-app

python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

pip install -r requirements.txt

uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs are at `http://localhost:8000/docs`.

Copy `.env.example` to `.env` and set any environment variables before starting the server.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will be available at `http://localhost:5173` and proxies API requests to the backend.

### Running Tests

```bash
pytest
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Health check — confirms the app is running |
| `GET` | `/config` | Returns the current `ENV` value, useful for verifying the active environment |
| `GET` | `/kana` | Returns all 92 kana (46 hiragana + 46 katakana) |
| `GET` | `/kana/{type}` | Returns kana filtered by type — `hiragana` or `katakana` |
| `GET` | `/quiz` | Generates and returns a random multiple-choice `QuizQuestion` |
| `POST` | `/quiz/answer` | Accepts a `QuizAnswer` body and returns a `QuizResult` with `correct` and `correct_answer` |

---

## Documentation

See [ARCHITECTURE.md](ARCHITECTURE.md) for a full breakdown of system design, data flow, module responsibilities, and frontend component planning.

---

## Planned Features

- **Spaced repetition** — SM-2 scheduling to surface kana due for review, replacing random selection
- **User persistence** — per-user progress tracking with streaks, attempt history, and last-seen dates
- **Similar-character distractors** — bias wrong answer choices toward visually similar kana

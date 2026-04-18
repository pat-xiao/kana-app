# Architecture

## System Overview

Kana App is a REST API for quizzing users on Japanese hiragana and katakana. It serves kana data, generates multiple-choice quiz questions, and evaluates user answers. There is no database or authentication — the app is stateless and loads kana from a static JSON file at startup.

---

## Tech Stack

| Technology | Role | Justification |
|---|---|---|
| Python 3.11+ | Language | Strong typing support via `typing` module; natural fit for Pydantic |
| FastAPI | Web framework | Automatic request/response validation, OpenAPI docs out of the box, async-ready |
| Pydantic v2 | Data modeling & validation | Enforces types at runtime; integrates natively with FastAPI |
| JSON | Kana data storage | The dataset is small and static; a database would be unnecessary overhead |

---

## Data Flow

### Generating a Question

1. Client sends `GET /quiz`
2. `main.py` calls `quiz.generate_question(_kana)`, passing the full in-memory kana list
3. `generate_question` picks one kana at random as the correct answer, samples 3 others for wrong choices (filtered by romaji to avoid duplicates), shuffles all 4, and returns a `QuizQuestion`
4. FastAPI serializes the `QuizQuestion` and returns it — the `answer` field is included in the response so the client can validate locally if needed

### Answering a Question

1. Client sends `POST /quiz/answer` with a `QuizAnswer` body: `{ "question": "あ", "user_answer": "a" }`
2. `main.py` looks up the kana by character from `_kana` to retrieve the correct romaji
3. A `QuizQuestion` is reconstructed with `answer` set to that romaji
4. `quiz.check_answer` compares `user_answer` to `question.answer` and returns a `QuizResult` with `correct` and `correct_answer` populated
5. FastAPI serializes the `QuizResult` and returns it

---

## Module Responsibilities

### `main.py`
The application entry point. Defines all HTTP routes, owns the in-memory `_kana` list (loaded once at startup), and wires together the data loader and quiz logic. Does not contain business logic.

### `models.py`
All Pydantic models used across the app:
- `Kana` — a single kana character with its romaji, type, and optional stroke order
- `QuizQuestion` — a generated question with a prompt, shuffled choices, and the correct answer
- `QuizAnswer` — the request body for answer submission (character + user's guess)
- `QuizResult` — the evaluated result returned to the client

### `quiz.py`
Pure quiz logic with no I/O or framework dependencies:
- `generate_question` — randomly constructs a `QuizQuestion` from a kana list
- `check_answer` — evaluates a `QuizQuestion` against a user answer and returns a `QuizResult`

### `data/loader.py`
Responsible for reading and validating `data/kana.json` at startup. Uses `Path(__file__).parent` for path resolution so the file can be found regardless of working directory. Returns a list of validated `Kana` objects.

---

## Frontend

The frontend is a separate React application built with Vite, located in `frontend/` within the same repo. It communicates with the FastAPI backend exclusively via `fetch` calls to the existing API endpoints. The frontend and backend are deployed independently as separate services — there is no server-side rendering or shared runtime.

### Components

| Component | Responsibility |
|---|---|
| `App` | Root component. Owns all shared state and coordinates transitions between quiz phases (selecting mode → answering → feedback). |
| `QuizCard` | Displays the kana character prompt and renders the four multiple-choice buttons. Disabled after an answer is submitted. |
| `ResultBanner` | Shows correct/incorrect feedback after each answer, including the correct romaji when the user was wrong. Clears on the next question. |
| `ScoreTracker` | Displays the current score and streak. Reads from state passed down by `App`. |
| `KanaSelectorPanel` | Lets the user choose hiragana, katakana, or both before starting or resetting a session. Selection is passed to `App` and used to filter the `/kana/{type}` request. |

### State

All state is owned by `App` and passed down as props:

| State | Type | Description |
|---|---|---|
| `currentQuestion` | `QuizQuestion \| null` | The active question returned by `GET /quiz`. Null before the first fetch and while loading. |
| `score` | `number` | Count of correct answers in the current session. |
| `streak` | `number` | Count of consecutive correct answers, reset to 0 on any wrong answer. |
| `quizMode` | `"hiragana" \| "katakana" \| "both"` | Selected by `KanaSelectorPanel`. Determines which kana subset is passed to question generation. |
| `answerFeedback` | `"pending" \| "correct" \| "incorrect"` | Drives the `ResultBanner` display and button disabled state. Reset to `"pending"` when the next question loads. |

### API Calls

**`GET /quiz`**
Fetches a new `QuizQuestion`. Called on session start and after each answer is acknowledged. The response includes `prompt`, `choices`, and `answer`.

**`POST /quiz/answer`**
Submits a `QuizAnswer` body — `{ question, user_answer }` — and receives a `QuizResult` with `correct` and `correct_answer`. The result drives the `answerFeedback` state update and `ScoreTracker` increment.

---

## Future Considerations

### Spaced Repetition
To implement spaced repetition (e.g. SM-2), the app would need to track per-user, per-kana performance over time — specifically the number of correct/incorrect attempts and the interval before next review. This would require:
- A user identity model (session token or user ID)
- A persistence layer (SQLite for local use, PostgreSQL for multi-user)
- A scheduling function that selects kana due for review rather than picking randomly
- An updated `generate_question` that accepts a filtered kana list based on due dates

### User Persistence
Currently the app is fully stateless. Adding user persistence would involve:
- A `User` model and an authentication layer (e.g. OAuth2 with JWT via `fastapi-users`)
- A `Progress` model tracking attempts, streak, and last-seen date per kana per user
- Database migrations (e.g. Alembic with SQLAlchemy)
- Updated endpoints to scope quiz generation and results to the authenticated user

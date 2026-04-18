from typing import Literal, Optional
from pydantic import BaseModel


class Kana(BaseModel):
    character: str
    romaji: str
    type: Literal["hiragana", "katakana"]
    stroke_order: Optional[list[str]] = None


class QuizQuestion(BaseModel):
    prompt: str
    choices: list[str]
    answer: str


class QuizResult(BaseModel):
    question: str
    user_answer: str
    correct: bool

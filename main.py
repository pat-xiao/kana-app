import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from typing import Literal
from models import Kana, QuizAnswer, QuizQuestion, QuizResult
from data.loader import load_kana
import quiz

app = FastAPI()

_kana: list[Kana] = load_kana()


@app.get("/")
def root():
    return {"message": "Kana app is running"}


@app.get("/config")
def get_config():
    return {"ENV": os.environ.get("ENV", "not set")}


@app.get("/kana", response_model=list[Kana])
def get_all_kana():
    return _kana


@app.get("/kana/{type}", response_model=list[Kana])
def get_kana_by_type(type: Literal["hiragana", "katakana"]):
    return [k for k in _kana if k.type == type]

@app.get("/quiz", response_model=QuizQuestion)
def get_quiz_question():
    return quiz.generate_question(_kana)


@app.post("/quiz/answer", response_model=QuizResult)
def check_question_answer(body: QuizAnswer):
    kana = next(k for k in _kana if k.character == body.question)
    question = QuizQuestion(prompt=kana.character, choices=[], answer=kana.romaji)
    return quiz.check_answer(question, body.user_answer)
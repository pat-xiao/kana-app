from fastapi import FastAPI
from typing import Literal
from models import Kana
from data.loader import load_kana

app = FastAPI()

_kana: list[Kana] = load_kana()


@app.get("/")
def root():
    return {"message": "Kana app is running"}


@app.get("/kana", response_model=list[Kana])
def get_all_kana():
    return _kana


@app.get("/kana/{type}", response_model=list[Kana])
def get_kana_by_type(type: Literal["hiragana", "katakana"]):
    return [k for k in _kana if k.type == type]

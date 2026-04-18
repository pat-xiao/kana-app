import json
from pathlib import Path
from models import Kana

_DATA_PATH = Path(__file__).parent / "kana.json"


def load_kana() -> list[Kana]:
    with open(_DATA_PATH, encoding="utf-8") as f:
        raw = json.load(f)
    return [Kana(**entry) for entry in raw]

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root_returns_200_with_message():
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_get_kana_returns_nonempty_list():
    response = client.get("/kana")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0


def test_get_kana_hiragana_all_hiragana():
    response = client.get("/kana/hiragana")
    assert response.status_code == 200
    data = response.json()
    assert all(k["type"] == "hiragana" for k in data)


def test_get_kana_katakana_all_katakana():
    response = client.get("/kana/katakana")
    assert response.status_code == 200
    data = response.json()
    assert all(k["type"] == "katakana" for k in data)


def test_get_kana_invalid_type_returns_422():
    response = client.get("/kana/invalid")
    assert response.status_code == 422


def test_get_quiz_returns_question_fields():
    response = client.get("/quiz")
    assert response.status_code == 200
    data = response.json()
    assert "prompt" in data
    assert "choices" in data
    assert "answer" in data


def test_post_quiz_answer_returns_result_fields():
    question = client.get("/quiz").json()
    response = client.post("/quiz/answer", json={
        "question": question["prompt"],
        "user_answer": question["answer"],
    })
    assert response.status_code == 200
    data = response.json()
    assert "correct" in data
    assert "correct_answer" in data


def test_get_config_returns_env_field():
    response = client.get("/config")
    assert response.status_code == 200
    assert "ENV" in response.json()

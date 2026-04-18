import pytest
from models import Kana, QuizQuestion
from quiz import check_answer, generate_question


@pytest.fixture
def kana_list() -> list[Kana]:
    return [
        Kana(character="あ", romaji="a",  type="hiragana"),
        Kana(character="い", romaji="i",  type="hiragana"),
        Kana(character="う", romaji="u",  type="hiragana"),
        Kana(character="え", romaji="e",  type="hiragana"),
        Kana(character="お", romaji="o",  type="hiragana"),
    ]


def test_generate_question_returns_quiz_question(kana_list: list[Kana]):
    result = generate_question(kana_list)
    assert isinstance(result, QuizQuestion)


def test_correct_answer_in_choices(kana_list: list[Kana]):
    question = generate_question(kana_list)
    assert question.answer in question.choices


def test_exactly_four_choices(kana_list: list[Kana]):
    question = generate_question(kana_list)
    assert len(question.choices) == 4


def test_wrong_choices_exclude_correct_answer(kana_list: list[Kana]):
    question = generate_question(kana_list)
    wrong = [c for c in question.choices if c != question.answer]
    assert question.answer not in wrong
    assert len(wrong) == 3


def test_check_answer_correct(kana_list: list[Kana]):
    question = generate_question(kana_list)
    result = check_answer(question, question.answer)
    assert result.correct is True


def test_check_answer_incorrect(kana_list: list[Kana]):
    question = generate_question(kana_list)
    wrong = next(c for c in question.choices if c != question.answer)
    result = check_answer(question, wrong)
    assert result.correct is False


def test_correct_answer_always_populated(kana_list: list[Kana]):
    question = generate_question(kana_list)
    result = check_answer(question, question.answer)
    assert result.correct_answer == question.answer

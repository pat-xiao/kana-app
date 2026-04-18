import random
from models import Kana, QuizQuestion, QuizResult


def generate_question(kana_list: list[Kana]) -> QuizQuestion:
    correct = random.choice(kana_list)
    wrong_pool = [k for k in kana_list if k.romaji != correct.romaji]
    wrong_choices = [k.romaji for k in random.sample(wrong_pool, 3)]
    choices = wrong_choices + [correct.romaji]
    random.shuffle(choices)
    return QuizQuestion(prompt=correct.character, choices=choices, answer=correct.romaji)


def check_answer(question: QuizQuestion, user_answer: str) -> QuizResult:
    return QuizResult(
        question=question.prompt,
        user_answer=user_answer,
        correct=user_answer == question.answer,
        correct_answer=question.answer,
    )

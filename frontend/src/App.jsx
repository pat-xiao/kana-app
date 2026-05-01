import { useState } from 'react'
import QuizConfigPanel from './components/QuizConfigPanel'
import QuizCard from './components/QuizCard'
import ResultBanner from './components/ResultBanner'
import ScoreTracker from './components/ScoreTracker'
import './App.css'

async function fetchQuestion() {
  const res = await fetch('/api/quiz')
  return res.json()
}

export default function App() {
  const [quizConfig, setQuizConfig] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [feedback, setFeedback] = useState('pending')
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [correctAnswer, setCorrectAnswer] = useState(null)

  async function handleStart(config) {
    setQuizConfig(config)
    setCurrentQuestion(await fetchQuestion())
  }

  async function handleAnswer(userAnswer) {
    const res = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: currentQuestion.prompt, user_answer: userAnswer }),
    })
    const result = await res.json()
    setFeedback(result.correct ? 'correct' : 'incorrect')
    setCorrectAnswer(result.correct_answer)
    if (result.correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
    } else {
      setStreak(0)
    }
  }

  async function handleNext() {
    setFeedback('pending')
    setCorrectAnswer(null)
    setCurrentQuestion(await fetchQuestion())
  }

  if (!quizConfig) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h1 style={{ marginBottom: '32px' }}>Kana App</h1>
        <QuizConfigPanel onStart={handleStart} />
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <ScoreTracker score={score} streak={streak} />
      {currentQuestion && (
        <QuizCard
          key={currentQuestion.prompt}
          question={currentQuestion}
          onAnswer={handleAnswer}
          feedback={feedback}
        />
      )}
      <ResultBanner feedback={feedback} correctAnswer={correctAnswer} />
      {feedback !== 'pending' && (
        <button
          onClick={handleNext}
          style={{
            alignSelf: 'center',
            padding: '10px 28px',
            borderRadius: '6px',
            border: 'none',
            background: '#4f46e5',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          Next
        </button>
      )}
    </div>
  )
}

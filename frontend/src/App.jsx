import { useState } from 'react'
import QuizConfigPanel from './components/QuizConfigPanel'
import QuizCard from './components/QuizCard'
import ResultBanner from './components/ResultBanner'
import ScoreTracker from './components/ScoreTracker'
import LoadingSpinner from './components/LoadingSpinner'
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
  const [darkMode, setDarkMode] = useState(false)
  const [loading, setLoading] = useState(false)

  function toggleDark() {
    const next = !darkMode
    setDarkMode(next)
    document.body.classList.toggle('dark', next)
  }

  async function handleStart(config) {
    setQuizConfig(config)
    setLoading(true)
    setCurrentQuestion(await fetchQuestion())
    setLoading(false)
  }

  async function handleAnswer(userAnswer) {
    setLoading(true)
    const res = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: currentQuestion.prompt, user_answer: userAnswer }),
    })
    const result = await res.json()
    setLoading(false)
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
    setLoading(true)
    setCurrentQuestion(await fetchQuestion())
    setLoading(false)
  }

  const toggleButton = (
    <button
      onClick={toggleDark}
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        background: 'none',
        border: 'none',
        fontSize: '1.4rem',
        cursor: 'pointer',
      }}
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )

  if (!quizConfig) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        {toggleButton}
        <h1 style={{ marginBottom: '32px' }}>Kana App</h1>
        <QuizConfigPanel onStart={handleStart} />
      </div>
    )
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {toggleButton}
      <ScoreTracker score={score} streak={streak} />
      {loading && !currentQuestion
        ? <LoadingSpinner message="Loading question..." />
        : currentQuestion && (
          <>
            <QuizCard
              key={currentQuestion.prompt}
              question={currentQuestion}
              onAnswer={handleAnswer}
              feedback={feedback}
              loading={loading}
            />
            {loading && feedback === 'pending' && <LoadingSpinner />}
          </>
        )
      }
      <ResultBanner feedback={feedback} correctAnswer={correctAnswer} />
      {feedback !== 'pending' && (
        <button
          disabled={loading}
          onClick={handleNext}
          style={{
            alignSelf: 'center',
            padding: '10px 28px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--color-accent)',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'default' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '100px',
            minHeight: '42px',
          }}
        >
          {loading ? <LoadingSpinner /> : 'Next'}
        </button>
      )}
    </div>
  )
}

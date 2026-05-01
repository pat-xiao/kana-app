import { useState } from 'react'

function getButtonStyle(choice, selected, correctAnswer, feedback) {
  const base = {
    fontSize: '1.1rem',
    padding: '10px 20px',
    borderRadius: '6px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'var(--color-border)',
    cursor: feedback === 'pending' ? 'pointer' : 'default',
    background: 'var(--color-bg)',
    color: 'var(--color-text-primary)',
    minWidth: '80px',
  }

  if (feedback === 'pending') return base

  if (choice === correctAnswer) {
    return { ...base, background: 'var(--color-correct)', borderColor: 'var(--color-correct)', color: '#fff' }
  }
  if (choice === selected && feedback === 'incorrect') {
    return { ...base, background: 'var(--color-incorrect)', borderColor: 'var(--color-incorrect)', color: '#fff' }
  }
  return { ...base, background: 'var(--color-surface)', color: 'var(--color-text-secondary)', borderColor: 'var(--color-border)' }
}

export default function QuizCard({ question, onAnswer, feedback, loading = false }) {
  const [selected, setSelected] = useState(null)

  function handleClick(choice) {
    if (feedback !== 'pending' || loading) return
    setSelected(choice)
    onAnswer(choice)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '5rem', margin: '0 0 24px', fontFamily: "'Noto Serif JP', serif" }}>{question.prompt}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {question.choices.map((choice) => (
          <button
            key={choice}
            disabled={feedback !== 'pending' || loading}
            onClick={() => handleClick(choice)}
            style={getButtonStyle(choice, selected, question.answer, feedback)}
          >
            {choice}
          </button>
        ))}
      </div>
    </div>
  )
}

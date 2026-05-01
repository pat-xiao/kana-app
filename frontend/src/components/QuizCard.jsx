import { useState } from 'react'

function getButtonStyle(choice, selected, correctAnswer, feedback) {
  const base = {
    fontSize: '1.1rem',
    padding: '10px 20px',
    borderRadius: '6px',
    border: '2px solid #ccc',
    cursor: feedback === 'pending' ? 'pointer' : 'default',
    background: '#fff',
    minWidth: '80px',
  }

  if (feedback === 'pending') return base

  if (choice === correctAnswer) {
    return { ...base, background: '#d4edda', borderColor: '#28a745', color: '#155724' }
  }
  if (choice === selected && feedback === 'incorrect') {
    return { ...base, background: '#f8d7da', borderColor: '#dc3545', color: '#721c24' }
  }
  return { ...base, background: '#f5f5f5', color: '#999' }
}

export default function QuizCard({ question, onAnswer, feedback }) {
  const [selected, setSelected] = useState(null)

  function handleClick(choice) {
    if (feedback !== 'pending') return
    setSelected(choice)
    onAnswer(choice)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '5rem', margin: '0 0 24px' }}>{question.prompt}</p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        {question.choices.map((choice) => (
          <button
            key={choice}
            disabled={feedback !== 'pending'}
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

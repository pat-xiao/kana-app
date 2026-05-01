import { useState } from 'react'

const KANA_TYPES = [
  { label: 'Hiragana', value: 'hiragana' },
  { label: 'Katakana', value: 'katakana' },
  { label: 'Both',     value: 'both' },
]

const QUIZ_MODES = [
  { label: 'Multiple Choice', value: 'multiple-choice' },
  { label: 'Free Text',       value: 'free-text' },
]

function optionButtonStyle(selected) {
  return {
    padding: '8px 18px',
    borderRadius: '6px',
    border: '2px solid',
    borderColor: selected ? 'var(--color-accent)' : 'var(--color-border)',
    background: selected ? 'var(--color-accent)' : 'var(--color-surface)',
    color: selected ? '#fff' : 'var(--color-text-primary)',
    cursor: 'pointer',
    fontWeight: selected ? '600' : '400',
  }
}

export default function QuizConfigPanel({ onStart }) {
  const [kanaType, setKanaType] = useState('both')
  const [quizMode, setQuizMode] = useState('multiple-choice')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>Kana Type</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {KANA_TYPES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setKanaType(value)}
              style={optionButtonStyle(kanaType === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>Quiz Mode</span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {QUIZ_MODES.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setQuizMode(value)}
              style={optionButtonStyle(quizMode === value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart({ kanaType, quizMode })}
        style={{
          padding: '10px 28px',
          borderRadius: '6px',
          border: 'none',
          background: 'var(--color-accent)',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: '600',
          cursor: 'pointer',
        }}
      >
        Start Quiz
      </button>
    </div>
  )
}

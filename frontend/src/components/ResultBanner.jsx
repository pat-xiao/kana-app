export default function ResultBanner({ feedback, correctAnswer }) {
  if (feedback === 'pending') return null

  const correct = feedback === 'correct'
  return (
    <div style={{
      padding: '12px 20px',
      borderRadius: '6px',
      background: correct ? '#d4edda' : '#f8d7da',
      color: correct ? '#155724' : '#721c24',
      border: `1px solid ${correct ? '#c3e6cb' : '#f5c6cb'}`,
      fontWeight: '600',
      textAlign: 'center',
    }}>
      {correct ? 'Correct!' : `Incorrect — the answer was: ${correctAnswer}`}
    </div>
  )
}

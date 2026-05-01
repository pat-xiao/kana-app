export default function ResultBanner({ feedback, correctAnswer }) {
  if (feedback === 'pending') return null

  const correct = feedback === 'correct'
  return (
    <div style={{
      padding: '12px 20px',
      borderRadius: '6px',
      background: correct ? 'var(--color-correct)' : 'var(--color-incorrect)',
      color: '#fff',
      fontWeight: '600',
      textAlign: 'center',
    }}>
      {correct ? 'Correct!' : `Incorrect — the answer was: ${correctAnswer}`}
    </div>
  )
}

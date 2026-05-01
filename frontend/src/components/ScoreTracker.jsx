export default function ScoreTracker({ score, streak }) {
  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      justifyContent: 'center',
      padding: '10px 20px',
      borderRadius: '6px',
      background: 'var(--color-surface)',
      color: 'var(--color-text-primary)',
      fontWeight: '600',
    }}>
      <span>Score: {score}</span>
      <span>Streak: {streak}</span>
    </div>
  )
}

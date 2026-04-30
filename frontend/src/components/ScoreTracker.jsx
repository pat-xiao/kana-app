export default function ScoreTracker({ score, streak }) {
  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      justifyContent: 'center',
      padding: '10px 20px',
      borderRadius: '6px',
      background: '#f5f5f5',
      fontWeight: '600',
    }}>
      <span>Score: {score}</span>
      <span>Streak: {streak}</span>
    </div>
  )
}

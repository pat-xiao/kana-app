export default function LoadingSpinner({ message }) {
  return (
    <>
      <style>{`
        @keyframes kana-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '3px solid var(--color-border)',
          borderTopColor: 'var(--color-accent)',
          animation: 'kana-spin 0.7s linear infinite',
        }} />
        {message && (
          <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
            {message}
          </span>
        )}
      </div>
    </>
  )
}

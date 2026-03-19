export const LoadingSpinner = ({ fullScreen = false, size = 'default' }) => {
  const cls = size === 'sm' ? 'spinner spinner-sm' : 'spinner';
  if (fullScreen) {
    return (
      <div className="loading-screen">
        <div className={cls} />
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading...</p>
      </div>
    );
  }
  return <div className={cls} />;
};

export function LoadingState({ label = "Loading…" }) {
  return <div className="muted" style={{ padding: "24px 0", textAlign: "center" }}>{label}</div>;
}

export function ErrorState({ message, onRetry }) {
  return (
    <div style={{ padding: "24px 0", textAlign: "center" }}>
      <div className="badge error" style={{ marginBottom: 10 }}>Error</div>
      <div className="muted" style={{ marginBottom: 10 }}>{message}</div>
      {onRetry && (
        <button className="btn btn-outline btn-sm" onClick={onRetry}>Retry</button>
      )}
    </div>
  );
}

export function EmptyState({ message = "No records found." }) {
  return <div className="muted" style={{ padding: "24px 0", textAlign: "center" }}>{message}</div>;
}

/** Wraps loading/error/empty handling around any fetched list so pages stay short. */
export function DataState({ loading, error, onRetry, isEmpty, emptyMessage, children }) {
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} onRetry={onRetry} />;
  if (isEmpty) return <EmptyState message={emptyMessage} />;
  return children;
}

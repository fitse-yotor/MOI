export default function ProgressBar({ pct, color }) {
  return (
    <div className="progress">
      <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, background: color }} />
    </div>
  );
}

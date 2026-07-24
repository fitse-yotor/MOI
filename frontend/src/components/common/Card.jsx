export function Card({ children, className = "", style, noPadding }) {
  return (
    <div className={`card ${className}`} style={{ ...(noPadding ? { padding: 0 } : {}), ...style }}>
      {children}
    </div>
  );
}

export function CardHead({ title, subtitle, action }) {
  return (
    <div className="card-head">
      <div className="card-title">
        {title}
        {subtitle && <small>{subtitle}</small>}
      </div>
      {action}
    </div>
  );
}

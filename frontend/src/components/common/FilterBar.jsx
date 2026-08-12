import NavIcon from "../layout/NavIcon.jsx";

export default function FilterBar({ filters = [], values = {}, onChange, actions }) {
  return (
    <div className="toolbar">
      {filters.map((f) =>
        f.type === "search" ? (
          <div className="search-box" key={f.key}>
            <NavIcon name="search" size={14} />
            <input
              placeholder={f.placeholder}
              value={values[f.key] || ""}
              onChange={(e) => onChange(f.key, e.target.value)}
            />
          </div>
        ) : (
          <select
            className="filter-select"
            key={f.key}
            value={values[f.key] || "all"}
            onChange={(e) => onChange(f.key, e.target.value)}
          >
            <option value="all">{f.allLabel || `All ${f.label}`}</option>
            {f.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )
      )}
      {actions && <div className="toolbar-actions">{actions}</div>}
    </div>
  );
}

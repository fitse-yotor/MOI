export default function DataTable({ columns = [], rows, data, rowKey = "id", keyExtractor, onRowClick }) {
  const items = rows || data || [];

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((c, colIdx) => {
              const headerText = c.label || c.header || `col_${colIdx}`;
              const headerKey = c.key || c.header || c.label || `th_${colIdx}`;
              return <th key={headerKey}>{headerText}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {items.map((row, rowIdx) => {
            const key = keyExtractor
              ? keyExtractor(row, rowIdx)
              : (row && typeof row === "object" && row[rowKey] != null ? row[rowKey] : rowIdx);

            return (
              <tr
                key={key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: "pointer" } : undefined}
              >
                {columns.map((c, colIdx) => {
                  const label = c.label || c.header || "";
                  const cellKey = c.key || c.header || c.label || `td_${colIdx}`;
                  let content = "—";
                  if (c.render) {
                    content = c.render(row);
                  } else if (c.accessor) {
                    content = c.accessor(row);
                  } else if (c.key && row) {
                    content = row[c.key] ?? "—";
                  }
                  return (
                    <td key={cellKey} data-label={label || undefined}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

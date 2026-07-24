import { useSnackbar } from "../../context/SnackbarContext.jsx";

export default function SnackbarHost() {
  const { items, dismiss } = useSnackbar();

  if (!items.length) return null;

  return (
    <div className="snackbar-host">
      {items.map((item) => (
        <div className={`snackbar ${item.tone}`} key={item.id}>
          <span style={{ flex: 1 }}>{item.message}</span>
          <button
            onClick={() => dismiss(item.id)}
            style={{ background: "none", border: "none", color: "#fff", opacity: 0.8 }}
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

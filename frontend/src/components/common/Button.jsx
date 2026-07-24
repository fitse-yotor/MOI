export default function Button({ variant = "primary", size, children, className = "", ...rest }) {
  const cls = ["btn", `btn-${variant}`, size === "sm" ? "btn-sm" : "", className].filter(Boolean).join(" ");
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

import { createContext, useCallback, useContext, useState } from "react";

const SnackbarContext = createContext(null);
let idCounter = 0;

export function SnackbarProvider({ children }) {
  const [items, setItems] = useState([]);

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const notify = useCallback(
    (message, tone = "info", durationMs = 3500) => {
      const id = ++idCounter;
      setItems((prev) => [...prev, { id, message, tone }]);
      setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss]
  );

  return (
    <SnackbarContext.Provider value={{ notify, items, dismiss }}>
      {children}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
}

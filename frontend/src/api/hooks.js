import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "./client.js";

/**
 * Generic data-fetching hook. Every page uses this instead of hardcoding
 * data, so information is always pulled live from the API.
 */
export function useApiGet(path, { deps = [], enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const refetch = useCallback(() => {
    if (!enabled || !path) return;
    const id = ++requestId.current;
    setLoading(true);
    setError(null);
    api
      .get(path)
      .then((res) => {
        if (id === requestId.current) setData(res);
      })
      .catch((err) => {
        if (id === requestId.current) setError(err.message || "Failed to load data");
      })
      .finally(() => {
        if (id === requestId.current) setLoading(false);
      });
  }, [path, enabled]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refetch(); }, [path, enabled, ...deps]);

  return { data, loading, error, refetch };
}

/** Generic mutation hook for POST/PUT actions triggered from the UI. */
export function useApiAction(method = "post") {
  const [pending, setPending] = useState(false);

  const run = useCallback(
    async (path, payload) => {
      setPending(true);
      try {
        return await api[method](path, payload);
      } finally {
        setPending(false);
      }
    },
    [method]
  );

  return { run, pending };
}

export function buildQuery(params = {}) {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "" && v !== "all");
  if (!entries.length) return "";
  return `?${new URLSearchParams(entries).toString()}`;
}

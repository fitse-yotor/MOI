import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, getToken, setToken } from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [ready, setReady] = useState(false);

  const loadMe = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      setPermissions(null);
      setReady(true);
      return;
    }
    try {
      const res = await api.get("/auth/me");
      setUser(res.user);
      setPermissions(res.permissions);
    } catch {
      setToken(null);
      setUser(null);
      setPermissions(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (username, password) => {
    const res = await api.post("/auth/login", { username, password });
    setToken(res.token);
    setUser(res.user);
    setPermissions(res.permissions);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      /* token may already be invalid — clear local state regardless */
    }
    setToken(null);
    setUser(null);
    setPermissions(null);
  }, []);

  const can = useCallback((moduleKey, action) => !!permissions?.[moduleKey]?.[action], [permissions]);

  const value = useMemo(
    () => ({ user, permissions, ready, login, logout, can }),
    [user, permissions, ready, login, logout, can]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

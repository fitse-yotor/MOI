import { createContext, useContext } from "react";
import { useApiGet, useApiAction } from "../api/hooks.js";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { data, loading, refetch } = useApiGet("/notifications");
  const { run } = useApiAction("post");

  const markAllRead = async () => {
    await run("/notifications/read-all");
    refetch();
  };

  const value = {
    notifications: data?.items || [],
    unreadCount: data?.unreadCount || 0,
    loading,
    refetch,
    markAllRead,
  };

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationProvider");
  return ctx;
}

import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SnackbarProvider } from "./context/SnackbarContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";
import AppRoutes from "./router/AppRoutes.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SnackbarProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </SnackbarProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

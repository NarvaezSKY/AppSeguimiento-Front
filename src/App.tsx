import { Route, Routes, useNavigate } from "react-router-dom";

import IndexPage from "@/pages/evidences/index";
import LoginPage from "./pages/login/login";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./pages/home";
import { useEffect, Suspense } from "react";
import { useAuthStore } from "./store/auth.store";
import { PublicRoute } from "./PublicRoute";
import UploadForm from "./pages/evidences/upload";
import ProfilePage from "./pages/profiles";
import { UsersByComponent } from "./pages/usersByComponent";
import { PowerBIReport } from "./pages/PowerBI";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    // Solo verificamos si NO estamos en la ruta de login
    // Esto previene conflictos con el flujo de login
    if (window.location.pathname === '/login') return;

    // Verificar token existente al montar la app
    const { verify } = useAuthStore.getState();
    verify().catch(() => {
      sessionStorage.removeItem("token");
      useAuthStore.getState().logout();
      navigate('/login', { replace: true });
    });
  }, []); // <-- run once on mount

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    }>
      <Routes>
        <Route
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
          path="/login"
        />

        <Route
          element={
            <ProtectedRoute>
              <UsersByComponent />
            </ProtectedRoute>
          }
          path="/:componentId/responsables"
        />

        <Route
          element={
            <ProtectedRoute>
              <IndexPage />
            </ProtectedRoute>
          }
          path="/evidences"
        />

        <Route
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
          path="/users/:userId"
        />

        <Route
          element={
            <ProtectedRoute>
              <IndexPage />
            </ProtectedRoute>
          }
          path="/evidences/:id"
        />
        <Route
          element={
            <ProtectedRoute>
              <UploadForm />
            </ProtectedRoute>
          }
          path="/evidences/upload"
        />

        <Route
          element={
            <ProtectedRoute>
              <PowerBIReport />
            </ProtectedRoute>
          }
          path="/reporte"
        />

        <Route
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
          path="/"
        />
      </Routes>
    </Suspense>
  );
}

export default App;

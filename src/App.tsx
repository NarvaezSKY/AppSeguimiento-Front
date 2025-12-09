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

    // call stable store methods via getState(), so deps can be []
    const { verify } = useAuthStore.getState();
    verify().catch(() => {
      sessionStorage.removeItem("token");
      useAuthStore.getState().logout();
      navigate('/login', { replace: true });
    });

    // Remove the user fetching from here - it should happen on login
  }, []); // <-- run once on mount

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
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

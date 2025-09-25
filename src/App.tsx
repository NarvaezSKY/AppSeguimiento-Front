import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/evidences/index";
import LoginPage from "./pages/login/login";
import ProtectedRoute from "./ProtectedRoute";
import HomePage from "./pages/home";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth.store";
import { PublicRoute } from "./PublicRoute";
import { useUsersStore } from "./store/users.store";
import UploadForm from "./pages/evidences/upload";
import ProfilePage from "./pages/profiles";
import { UsersByComponent } from "./pages/usersByComponent";
import { PowerBIReport } from "./pages/PowerBI";

function App() {
  const { verify } = useAuthStore();
  const { getAllUsers } = useUsersStore();

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      getAllUsers();
      verify().catch(() => {
        sessionStorage.removeItem("token");
        useAuthStore.getState().logout();
      });
    }
  }, [verify]);

  return (
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
  );
}

export default App;

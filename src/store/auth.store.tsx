import { create } from "zustand";
import { loginUseCase } from "@/core/auth/application/login.use-case";
import { registerUseCase } from "@/core/auth/application/register.use-case";
import { verifyUseCase } from "@/core/auth/application/verify.use-case";

import { authRepository } from "@/core/auth/infrastructure/auth.repository";

interface AuthState {
  isLoading: boolean;
  user: any;
  error: string | null;
  verifyError: string | null;
  login: (email: string, password: string) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  verify: () => Promise<any>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: false,
  error: null,
  user: null,
  verifyError: null,
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const login = loginUseCase(authRepository);
      const result = await login({ email, password });
      if (result?.data?.token) {
        sessionStorage.setItem("token", result.data.token);
      }
      set({ isLoading: false, user: result.data });
      return result;
    } catch (err: any) {
      set({
        isLoading: false,
        error: err.response.data.message || "Error al iniciar sesión",
      });
      throw err;
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const register = registerUseCase(authRepository);
      const result = await register(data);
      set({ isLoading: false });
      return result;
    } catch (err: any) {
      set({ isLoading: false, error: err.message || "Error al registrar" });
      throw err;
    }
  },

  verify: async () => {
    set({ isLoading: true, error: null });
    try {
      const verify = verifyUseCase(authRepository);
      const result = await verify();
      set({ isLoading: false, verifyError: null, user: result.data });
      return result;
    } catch (err: any) {
      set({ isLoading: false, verifyError: err.message || "Error al verificar" });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      sessionStorage.removeItem("token");
      set({ isLoading: false, user: null });
    } catch (err: any) {
      set({ isLoading: false, error: err.message || "Error al cerrar sesión" });
      throw err;
    }
  },

  initialize: async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        set({ isLoading: true });
        const verify = verifyUseCase(authRepository);
        const result = await verify();
        set({ isLoading: false, verifyError: null, user: result.data });
      } catch (err: any) {
        set({ isLoading: false, verifyError: err.message || "Error al verificar" });
        sessionStorage.removeItem("token");
      }
    }
  },
}));

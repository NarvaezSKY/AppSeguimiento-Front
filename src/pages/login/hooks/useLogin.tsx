import { useAuthStore } from "@/store/auth.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      toast.error(
        err?.message || "Error al iniciar sesión. Verifica tus credenciales."
      );
      return false;
    }
  };

  return {
    handleLogin,
    isLoading,
    error,
  };
}
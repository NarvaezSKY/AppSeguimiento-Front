import { useAuthStore } from "@/store/auth.store";
import { useUsersStore } from "@/store/users.store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function useLogin() {
  const login = useAuthStore((state) => state.login);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const navigate = useNavigate();
  const { getAllUsers } = useUsersStore();

  const handleLogin = async (email: string, password: string) => {
    try {
      // 1. Primero autenticamos
      await login(email, password);
      
      // 2. Precargamos datos necesarios ANTES de navegar
      try {
        await getAllUsers();
      } catch (userErr) {
        // Si falla getAllUsers, aún permitimos login pero logueamos el error
        console.warn("No se pudieron cargar usuarios inicialmente:", userErr);
      }
      
      // 3. Solo navegamos cuando todo está listo
      toast.success("Iniciaste sesión exitosamente");
      navigate("/", { replace: true });
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
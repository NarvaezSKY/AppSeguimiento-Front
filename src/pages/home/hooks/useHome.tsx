import { useCallback, useEffect } from "react";
import { useTasksStore } from "@/store/tasks.store";
import { toast } from "sonner";
import { IComponents } from "@/core/tasks/domain/get-components/get-components.res";
import { useUsersStore } from "@/store/users.store";

interface UseHomeResult {
  components: IComponents[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export default function useHome(): UseHomeResult {
  const { getAllUsers } = useUsersStore();
  const components = useTasksStore((s) => s.components);
  const isLoading = useTasksStore((s) => s.isLoading);
  const error = useTasksStore((s) => s.error);

  const getComponents = useTasksStore((s) => s.getComponents);
  const clearError = useTasksStore((s) => s.clearError);

  const refresh = useCallback(async () => {
    try {
      await getComponents();
      // Intentar cargar usuarios, pero no fallar si no se puede
      try {
        await getAllUsers();
      } catch (userErr) {
        console.warn("No se pudieron cargar usuarios:", userErr);
      }
    } catch (err) {
      console.error("Error al cargar componentes:", err);
      toast.error("Error al cargar los componentes");
    }
  }, [getComponents, getAllUsers]);

  useEffect(() => {
    refresh();
  }, [refresh]);


  return {
    components,
    isLoading,
    error,
    refresh,
    clearError,
  };
}

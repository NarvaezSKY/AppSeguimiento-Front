import { useTasksStore } from "@/store/tasks.store";
import { useUsersStore } from "@/store/users.store";
import { useCallback, useEffect } from "react";

export const useUsersByComponent = (componentId: string) => {
  const {
    usersInComponent,
    getUsersByComponent,
    isLoading: isLoadingUsersByComponent,
  } = useTasksStore();
  
  const { users, getAllUsers } = useUsersStore();

  const refresh = useCallback(async () => {
    await getUsersByComponent(componentId);
  }, [getUsersByComponent, componentId]);

  useEffect(() => {
    // Cargar usuarios del sidebar si no están cargados
    if (!users || users.length === 0) {
      getAllUsers();
    }
    refresh();
  }, [refresh, users, getAllUsers]);

  return {
    usersInComponent,
    isLoadingUsersByComponent,
    refresh,
  };
};

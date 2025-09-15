import { useTasksStore } from "@/store/tasks.store";
import { useCallback, useEffect } from "react";

export const useUsersByComponent = (componentId: string) => {
  const {
    usersInComponent,
    getUsersByComponent,
    isLoading: isLoadingUsersByComponent,
  } = useTasksStore();

  const refresh = useCallback(async () => {
    await getUsersByComponent(componentId);
  }, [getUsersByComponent, componentId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    usersInComponent,
    isLoadingUsersByComponent,
    refresh,
  };
};

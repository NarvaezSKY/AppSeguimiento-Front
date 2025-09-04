import { useCallback, useEffect } from "react";
import { IEvidence } from "@/core/tasks/domain/upload-evidence";
import { useTasksStore } from "@/store/tasks.store";

interface UseHomeResult {
  evidences: IEvidence[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export default function useHome(): UseHomeResult {
  const evidences = useTasksStore((s) => s.evidences);
  const isLoading = useTasksStore((s) => s.isLoading);
  const error = useTasksStore((s) => s.error);
  const getAllEvidences = useTasksStore((s) => s.getAllEvidences);
  const clearError = useTasksStore((s) => s.clearError);

  const refresh = useCallback(async () => {
    try {
      await getAllEvidences();
    } catch {
      // el store ya guarda el error, no es necesario manejarlo aquí
    }
  }, [getAllEvidences]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { evidences, isLoading, error, refresh, clearError };
}
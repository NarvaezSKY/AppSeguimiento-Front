import { useCallback, useEffect, useMemo, useState } from "react";
import { useTasksStore } from "@/store/tasks.store";
import { toast } from "sonner";
import { IComponents } from "@/core/tasks/domain/get-components/get-components.res";
import { IEvidence } from "@/core/tasks/domain/upload-evidence/upload-evidence.res";
import { useUsersStore } from "@/store/users.store";

interface UseHomeResult {
  components: IComponents[];
  isLoading: boolean;
  error: string | null;
  dueMonthLabel: string;
  dashboardEvidences: IEvidence[];
  upcomingEvidences: IEvidence[];
  overdueEvidences: IEvidence[];
  overdueCount: number;
  isDashboardLoading: boolean;
  refresh: () => Promise<void>;
  refreshEvidencesDashboard: () => Promise<void>;
  clearError: () => void;
}

const extractEvidenceItems = (result: any): IEvidence[] => {
  const topLayer = result?.data ?? result;
  const inner = topLayer?.data ?? topLayer;

  if (Array.isArray(inner?.items)) return inner.items as IEvidence[];
  if (Array.isArray(inner)) return inner as IEvidence[];
  return [];
};

export default function useHome(): UseHomeResult {
  const { getAllUsers } = useUsersStore();
  const components = useTasksStore((s) => s.components);
  const isLoading = useTasksStore((s) => s.isLoading);
  const error = useTasksStore((s) => s.error);
  const getAllEvidences = useTasksStore((s) => s.getAllEvidences);
  const [dashboardEvidences, setDashboardEvidences] = useState<IEvidence[]>([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(false);

  const getComponents = useTasksStore((s) => s.getComponents);
  const clearError = useTasksStore((s) => s.clearError);

  const { dueYear, monthsRange, dueMonthLabel } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const prevMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const monthsRange = Array.from(
      { length: prevMonth },
      (_, index) => index + 1,
    );

    const fromLabel = new Intl.DateTimeFormat("es-CO", {
      month: "long",
    }).format(new Date(prevYear, 0, 1));

    const toLabel = new Intl.DateTimeFormat("es-CO", {
      month: "long",
    }).format(new Date(prevYear, prevMonth - 1, 1));

    const dueMonthLabel = `${fromLabel} - ${toLabel} ${prevYear}`;

    return {
      dueYear: prevYear,
      monthsRange,
      dueMonthLabel,
    };
  }, []);

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

  const refreshEvidencesDashboard = useCallback(async () => {
    setIsDashboardLoading(true);
    try {
      const results = await Promise.all(
        monthsRange.map((month) =>
          getAllEvidences({
            mes: month,
            anio: dueYear,
            estado: "Por entregar",
            page: 1,
            limit: 200,
          }),
        ),
      );

      const merged = results.flatMap((result) => extractEvidenceItems(result));
      const uniqueById = merged.filter(
        (evidence, index, self) =>
          self.findIndex((candidate) => candidate._id === evidence._id) === index,
      );

      setDashboardEvidences(uniqueById);
    } catch {
      toast.error("No se pudo cargar el dashboard de evidencias");
    } finally {
      setIsDashboardLoading(false);
    }
  }, [dueYear, getAllEvidences, monthsRange]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    refreshEvidencesDashboard();
  }, [refreshEvidencesDashboard]);

  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const sortedEvidences = useMemo(() => {
    return [...dashboardEvidences].sort((a, b) => {
      const dateA = new Date(a.fechaEntrega).getTime();
      const dateB = new Date(b.fechaEntrega).getTime();
      return dateA - dateB;
    });
  }, [dashboardEvidences]);

  const upcomingEvidences = useMemo(() => {
    return sortedEvidences.filter((ev) => {
      const dueDate = new Date(ev.fechaEntrega);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= startOfToday;
    });
  }, [sortedEvidences, startOfToday]);

  const overdueCount = useMemo(() => {
    return dashboardEvidences.filter((ev) => {
      const dueDate = new Date(ev.fechaEntrega);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < startOfToday;
    }).length;
  }, [dashboardEvidences, startOfToday]);

  const overdueEvidences = useMemo(() => {
    return sortedEvidences.filter((ev) => {
      const dueDate = new Date(ev.fechaEntrega);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < startOfToday;
    });
  }, [sortedEvidences, startOfToday]);


  return {
    components,
    isLoading,
    error,
    dueMonthLabel,
    dashboardEvidences,
    upcomingEvidences,
    overdueEvidences,
    overdueCount,
    isDashboardLoading,
    refresh,
    refreshEvidencesDashboard,
    clearError,
  };
}

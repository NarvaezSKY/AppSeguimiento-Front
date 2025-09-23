import { useEffect, useMemo, useState } from "react";
import { useUsersStore } from "@/store/users.store";
import { useTasksStore } from "@/store/tasks.store";
import mapActivitiesToOptions from "../utils/actividades";
import mapComponentsToOptions from "../utils/componentes";
import { truncate } from "../utils/truncate";

export default function useProfile(userId: string | null) {
  const { users, getAllUsers } = useUsersStore();

  const {
    evidences,
    getAllEvidences,
    isLoading,
    lastComponentId,
    components,
    getComponents,
    getActividadesByResponsable,
    activitiesInProfile,
  } = useTasksStore();

  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedTrimestre, setSelectedTrimestre] = useState<number | null>(
    null
  );

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );
  const selectActivity = (id: string | null) => {
    setSelectedActivityId(id);
  };

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [manualComponentSelection, setManualComponentSelection] =
    useState(false);

  const selectComponent = (id: string | null) => {
    setSelectedComponentId(id);
    setManualComponentSelection(true);
  };

  useEffect(() => {
    getComponents?.().catch(() => {});
  }, [getComponents]);

  useEffect(() => {
    if (!userId) return;
    getActividadesByResponsable?.(userId).catch(() => {});
  }, [userId, getActividadesByResponsable]);

  useEffect(() => {
    if (!selectedActivityId) return;
    const exists = activitiesInProfile?.some((a: any) => a._id === selectedActivityId);
    if (!exists) setSelectedActivityId(null);
  }, [activitiesInProfile, selectedActivityId]);

  useEffect(() => {
    if (!users || users.length === 0) getAllUsers?.();

    const effectiveComponentId =
      manualComponentSelection || selectedComponentId
        ? selectedComponentId
        : (lastComponentId ?? null);

    const query: Record<string, any> = {};
    if (userId) query.responsable = userId;
    if (selectedEstado) query.estado = selectedEstado;
    if (selectedTrimestre !== null && selectedTrimestre !== undefined)
      query.trimestre = Number(selectedTrimestre);
    if (effectiveComponentId) query.componente = effectiveComponentId;

    if (selectedActivityId) query.actividad = selectedActivityId;

    getAllEvidences?.(query).catch(() => {});
  }, [
    userId,
    selectedEstado,
    selectedTrimestre,
    selectedComponentId,
    manualComponentSelection,
    lastComponentId,
    getAllEvidences,
    getAllUsers,
    users,
    selectedActivityId,
  ]);

  const user = useMemo(() => users?.find((u) => u._id === userId), [users, userId]);

  const userEvidences = useMemo(() => {
    if (!user) return [];
    return (
      evidences?.filter((ev: any) =>
        ev.responsables?.some((r: any) => r._id === user._id)
      ) || []
    );
  }, [evidences, user]);

  const effectiveComponentId =
    manualComponentSelection || selectedComponentId
      ? selectedComponentId
      : (lastComponentId ?? null);

  const effectiveComponent = (components ?? []).find(
    (c: any) => c._id === effectiveComponentId
  );
  const effectiveComponentLabel = effectiveComponent
    ? truncate(effectiveComponent.nombreComponente)
    : "Todos";

  const selectedActivity = activitiesInProfile?.find(
    (a: any) => a._id === selectedActivityId
  );
  const selectedActivityLabel = selectedActivity
    ? truncate(selectedActivity.actividad)
    : "Todas las actividades";

  const activityOptions = mapActivitiesToOptions(activitiesInProfile ?? [], 80);
  const componentOptions = mapComponentsToOptions(components ?? [], 50);

  return {
    user,
    userEvidences,
    effectiveComponent,
    effectiveComponentLabel,
    componentOptions,
    selectComponent,
    selectedActivity,
    selectedActivityLabel,
    activityOptions,
    selectActivity,
    selectedEstado,
    setSelectedEstado,
    selectedTrimestre,
    setSelectedTrimestre,
    isLoading,
  };
}
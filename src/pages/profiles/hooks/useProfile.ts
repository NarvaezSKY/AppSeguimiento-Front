import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useUsersStore } from "@/store/users.store";
import { useTasksStore } from "@/store/tasks.store";
import mapComponentsToOptions from "../utils/componentes";
import { truncate } from "../utils/truncate";

type ActivityOptionWithYear = {
  value: string;
  label: string;
  title: string;
  year: number;
};

type ProfileActivity = {
  _id: string;
  actividad: string;
  metaAnual: number;
  year: number;
};

export default function useProfile(userId: string | null) {
  const { users, getAllUsers } = useUsersStore();

  const {
    evidences,
    getAllEvidences,
    isLoading,
    lastComponentId,
    userComponents,
    getComponentsByResponsable,
    getActividadesByResponsable,
    activitiesInProfile,
  } = useTasksStore();

  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedTrimestre, setSelectedTrimestre] = useState<number | null>(
    null
  );
  const [selectedAnio, setSelectedAnio] = useState<number>(2026);

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

  const safeDefaultComponentId = useMemo(() => {
    if (!lastComponentId) return null;

    const existsInUserComponents = (userComponents ?? []).some(
      (component: any) => component?._id === lastComponentId
    );

    return existsInUserComponents ? lastComponentId : null;
  }, [lastComponentId, userComponents]);

  // Resetea filtros de forma sincrona al cambiar de perfil para evitar fetch con estado previo.
  useLayoutEffect(() => {
    if (userId) {
      setSelectedEstado(null);
      setSelectedTrimestre(null);
      setSelectedAnio(2026);
      setSelectedActivityId(null);
      setSelectedComponentId(null);
      setManualComponentSelection(false);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    getComponentsByResponsable?.(userId).catch(() => { });
  }, [userId, getComponentsByResponsable]);

  // Nuevo useEffect para obtener actividades cuando cambie el componente seleccionado
  useEffect(() => {
    if (!userId) return;

    const effectiveComponentId = manualComponentSelection || selectedComponentId
      ? selectedComponentId
      : safeDefaultComponentId;

    const requestData = {
      responsableId: userId,
      ...(effectiveComponentId && { componenteId: effectiveComponentId })
    };

    getActividadesByResponsable?.(requestData).catch(() => { });
  }, [
    userId,
    selectedComponentId,
    manualComponentSelection,
    safeDefaultComponentId,
    getActividadesByResponsable,
  ]);

  useEffect(() => {
    if (!selectedActivityId) return;
    const exists = Object.values(activitiesInProfile ?? {}).some((activities) =>
      activities.some((activity: any) => activity._id === selectedActivityId)
    );
    if (!exists) setSelectedActivityId(null);
  }, [activitiesInProfile, selectedActivityId]);

  useEffect(() => {
    if (!users || users.length === 0) getAllUsers?.();
  }, [users, getAllUsers]);

  useEffect(() => {
    // Usar userComponents en lugar de components para el componente efectivo
    if (!userId) return;

    const effectiveComponentId =
      manualComponentSelection || selectedComponentId
        ? selectedComponentId
        : safeDefaultComponentId;

    const query: Record<string, any> = {};
    if (userId) query.responsable = userId;
    if (selectedEstado) query.estado = selectedEstado;
    if (selectedTrimestre !== null && selectedTrimestre !== undefined)
      query.trimestre = Number(selectedTrimestre);
    query.anio = Number(selectedAnio);
    if (effectiveComponentId) query.componente = effectiveComponentId;

    if (selectedActivityId) query.actividad = selectedActivityId;

    getAllEvidences?.(query).catch(() => { });
  }, [
    userId,
    selectedEstado,
    selectedTrimestre,
    selectedAnio,
    selectedComponentId,
    manualComponentSelection,
    safeDefaultComponentId,
    getAllEvidences,
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
      : safeDefaultComponentId;

  // Cambiar para usar userComponents en lugar de components
  const effectiveComponent = (userComponents ?? []).find(
    (c: any) => c._id === effectiveComponentId
  );
  const effectiveComponentLabel = effectiveComponent
    ? truncate(effectiveComponent.nombreComponente)
    : "Todos";

  const flatActivitiesInProfile = useMemo<ProfileActivity[]>(() => {
    return Object.entries(activitiesInProfile ?? {})
      .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
      .flatMap(([year, activities]) =>
        (activities ?? []).map((activity: any) => ({
          ...activity,
          year: Number(year),
        }))
      );
  }, [activitiesInProfile]);

  const selectedActivity = flatActivitiesInProfile.find(
    (a: any) => a._id === selectedActivityId
  );
  const selectedActivityLabel = selectedActivity
    ? truncate(selectedActivity.actividad)
    : "Todas las actividades";

  const activityOptions = useMemo<ActivityOptionWithYear[]>(() => {
    return flatActivitiesInProfile
      .map((activity) => {
        const title = activity.actividad ?? "";

        return {
          value: activity._id,
          label: truncate(title, 80),
          title,
          year: activity.year,
        };
      })
      .sort((a, b) => {
        const yearDiff = b.year - a.year;
        if (yearDiff !== 0) return yearDiff;

        return a.title.localeCompare(b.title, "es", { sensitivity: "base" });
      });
  }, [flatActivitiesInProfile]);

  // Cambiar para usar userComponents en lugar de components
  const componentOptions = mapComponentsToOptions(userComponents ?? [], 50);
  const yearOptions = useMemo(
    () => [
      { value: 2026, label: "2026" },
      { value: 2025, label: "2025" },
    ],
    []
  );

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
    selectedAnio,
    setSelectedAnio,
    yearOptions,
    selectedTrimestre,
    setSelectedTrimestre,
    isLoading,
  };
}
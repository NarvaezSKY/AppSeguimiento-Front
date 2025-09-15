import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasksStore } from "../../../../store/tasks.store";
import { useUsersStore } from "../../../../store/users.store";
import { TIPOS_EVIDENCIA } from "../options/tiposDeEvidencia";
import { MESES } from "../options/meses";
import { ESTADOS } from "../options/estados";
import { trimestres } from "../options/meses";

export function useUpload() {
  // store bindings
  const getComponents = useTasksStore((s) => s.getComponents);
  const components = useTasksStore((s) => s.components);
  const error = useTasksStore((s) => s.error);
  const uploadTask = useTasksStore((s) => s.uploadTask);
  const isUploadingActivity = useTasksStore((s) => s.isUploadingActivity);
  const isUploadingEvidence = useTasksStore((s) => s.isUploadingEvidence);
  const users = useUsersStore((s) => s.users);

  // single combined form
  const { register, handleSubmit, reset, setValue, control } = useForm<any>();

  // selection + state
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [taskUploaded, setTaskUploaded] = useState(false);
  const [selectedResponsables, setSelectedResponsables] = useState<string[]>(
    []
  );
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedMes, setSelectedMes] = useState<number | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedTrimestre, setSelectedTrimestre] = useState<number | null>(null);
  const [selectedConcurrencia, setSelectedConcurrencia] = useState<
    number | null
  >(null);

  // load components
  useEffect(() => {
    getComponents().catch(() => {});
  }, [getComponents]);

  const componentOptions = useMemo(
    () =>
      (components ?? []).map((c: any) => ({
        id: c._id,
        label: c.nombreComponente ?? c.componente ?? c.nombre,
      })),
    [components]
  );

  const toggleResponsable = (uid: string) => {
    setSelectedResponsables((prev) =>
      prev.includes(uid) ? prev.filter((x) => x !== uid) : [...prev, uid]
    );
  };

  const setTipo = (v: string | null) => setSelectedTipo(v);
  const setMes = (v: number | null) => {
    setSelectedMes(v);
    // autocomplete fechaEntrega: day 5 of next month, year fixed to 2025
    if (v && typeof v === "number") {
      // v is 1-12 (MESES options expected)
      const nextMonth = v === 12 ? 1 : v + 1;
      const year = 2025;
      const mm = String(nextMonth).padStart(2, "0");
      const dd = "05";
      const dateStr = `${year}-${mm}-${dd}`;
      try {
        setValue("fechaEntrega", dateStr, {
          shouldDirty: true,
          shouldTouch: true,
        });
      } catch (e) {
        // ignore
      }
    } else {
      // clear fechaEntrega when month cleared
      try {
        setValue("fechaEntrega", "", { shouldDirty: true, shouldTouch: true });
      } catch (e) {}
    }
  };
  const setEstado = (v: string | null) => setSelectedEstado(v);
  const setTrimestre = (v: number | null) => setSelectedTrimestre(v);
  const setConcurrencia = (v: number | null) => setSelectedConcurrencia(v);

  // Combined submit: uploads activity then evidence using activity id
  const onSubmit = async (data: any) => {
    if (!selectedComponentId) {
      alert("Selecciona un componente primero");
      return;
    }

    // ensure dropdown fields selected
    if (!selectedTipo) {
      alert("Selecciona un tipo de evidencia");
      return;
    }

    if (!selectedMes) {
      alert("Selecciona un mes");
      return;
    }

    if (!selectedEstado) {
      alert("Selecciona un estado");
      return;
    }

    if (!selectedConcurrencia) {
      alert("Selecciona concurrencia de evidencia");
      return;
    }

    const activityPayload = {
      componente: selectedComponentId,
      actividad: data.actividad,
      metaAnual: Number(selectedConcurrencia), // Usar concurrencia seleccionada
    };

    const evidencePayload: any = {
      tipoEvidencia: selectedTipo ?? data.tipoEvidencia,
      mes: Number(selectedMes ?? data.mes),
      anio: Number(data.anio),
      fechaEntrega: data.fechaEntrega,
      responsables: selectedResponsables,
      estado: selectedEstado ?? data.estado,
      trimestre: selectedTrimestre ?? data.trimestre,
      // actividad will be appended by the store.uploadTask
    };

    try {
      setTaskUploaded(false);
      await uploadTask(activityPayload, evidencePayload);
      setTaskUploaded(true);
      reset();
      setSelectedComponentId(null);
      setSelectedResponsables([]);
      setSelectedConcurrencia(null); // limpiar concurrencia al resetear
    } catch (err) {
      console.error(err);
      setTaskUploaded(false);
    }
  };

  return {
    register,
    control,
    handleSubmit,
    reset,
    componentOptions,
    users,
    selectedComponentId,
    setSelectedComponentId,
    selectedResponsables,
    toggleResponsable,
    // tipo / mes / estado selections
    TIPOS_EVIDENCIA,
    MESES,
    ESTADOS,
    selectedTipo,
    setTipo,
    selectedMes,
    setMes,
    selectedEstado,
    setEstado,
    selectedConcurrencia,
    setConcurrencia,
    isUploadingActivity,
    isUploadingEvidence,
    error,
    taskUploaded,
    onSubmit,
    trimestres,
    selectedTrimestre,
    setTrimestre,
  };
}

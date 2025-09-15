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
  const { register, handleSubmit, reset, control, getValues } =
    useForm<any>();

  // selection + state
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [taskUploaded, setTaskUploaded] = useState(false);
  const [selectedResponsables, setSelectedResponsables] = useState<string[]>(
    []
  );
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedConcurrencia, setSelectedConcurrencia] = useState<
    number | null
  >(null);

  // nuevo: estado general de trimestre (opcional)
  const [selectedTrimestre, setSelectedTrimestre] = useState<number | null>(null);

  // evidence entries: each entry has mes, trimestre, fechaEntrega (computed)
  const [evidenceEntries, setEvidenceEntries] = useState<
    { mes: number | null; trimestre: number | null; fechaEntrega: string | null }[]
  >([{ mes: null, trimestre: null, fechaEntrega: null }]);

  // helper to compute fechaEntrega (05 of next month), handling year rollover
  const computeFechaEntrega = (mes: number, anio: number) => {
    if (!mes) return "";
    const nextMonth = mes === 12 ? 1 : mes + 1;
    const year = mes === 12 ? Number(anio) + 1 : Number(anio);
    const mm = String(nextMonth).padStart(2, "0");
    const dd = "05";
    return `${year}-${mm}-${dd}`;
  };

  // ensure evidenceEntries length matches count (preserve existing values when possible)
  const ensureEntries = (count: number) => {
    setEvidenceEntries((prev) => {
      const next = [...prev];
      if (next.length > count) {
        return next.slice(0, count);
      } else {
        while (next.length < count) {
          next.push({ mes: null, trimestre: null, fechaEntrega: null });
        }
        return next;
      }
    });
  };

  // when concurrencia changes, generate the appropriate number of entry slots
  useEffect(() => {
    const n = selectedConcurrencia && selectedConcurrencia > 0 ? selectedConcurrencia : 1;
    ensureEntries(n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConcurrencia]);

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
  const setEstado = (v: string | null) => setSelectedEstado(v);
  const setTrimestre = (v: number | null) => setSelectedTrimestre(v);

  // setters for individual evidence entries
  const setEntryMes = (index: number, mes: number | null) => {
    setEvidenceEntries((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] ?? { mes: null, trimestre: null, fechaEntrega: null }), mes };
      // compute fechaEntrega using form year
      const anioVal = getValues("anio") ?? "2025";
      if (mes && Number.isInteger(mes)) {
        next[index].fechaEntrega = computeFechaEntrega(mes, Number(anioVal));
      } else {
        next[index].fechaEntrega = null;
      }
      return next;
    });
  };

  const setEntryTrimestre = (index: number, trimestre: number | null) => {
    setEvidenceEntries((prev) => {
      const next = [...prev];
      next[index] = { ...(next[index] ?? { mes: null, trimestre: null, fechaEntrega: null }), trimestre };
      return next;
    });
  };

  const setConcurrencia = (v: number | null) => {
    setSelectedConcurrencia(v);
    const n = v && v > 0 ? v : 1;
    ensureEntries(n);
  };

  // Combined submit: uploads activity then evidence(s) using activity id
  const onSubmit = async (data: any) => {
    if (!selectedComponentId) {
      alert("Selecciona un componente primero");
      return;
    }

    if (!selectedTipo) {
      alert("Selecciona un tipo de evidencia");
      return;
    }

    if (!selectedEstado) {
      alert("Selecciona un estado");
      return;
    }

    const entries = evidenceEntries.length > 0 ? evidenceEntries : [{ mes: null, trimestre: null, fechaEntrega: null }];

    // validate all entries have mes and fechaEntrega and trimestre (user requested manual fill)
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      if (!e.mes) {
        alert(`Falta seleccionar mes en la evidencia ${i + 1}`);
        return;
      }
      if (!e.trimestre) {
        alert(`Falta seleccionar trimestre en la evidencia ${i + 1}`);
        return;
      }
      if (!e.fechaEntrega) {
        alert(`Fecha de entrega no calculada en la evidencia ${i + 1}`);
        return;
      }
    }

    // confirm when multiple
    if (entries.length > 1) {
      const summary = entries
        .map((e, idx) => `#${idx + 1}: mes=${e.mes}, trimestre=${e.trimestre}, fechaEntrega=${e.fechaEntrega}`)
        .join("\n");
      const confirmed = window.confirm(
        `Se crearán ${entries.length} evidencias para esta actividad:\n\n${summary}\n\n¿Continuar?`
      );
      if (!confirmed) return;
    }

    const activityPayload = {
      componente: selectedComponentId,
      actividad: data.actividad,
      metaAnual: Number(selectedConcurrencia) || 1,
    };

    // build array of evidence payloads
    const evidencePayloads = entries.map((e) => ({
      tipoEvidencia: selectedTipo ?? data.tipoEvidencia,
      mes: Number(e.mes),
      anio: Number(data.anio),
      fechaEntrega: e.fechaEntrega,
      responsables: selectedResponsables,
      estado: selectedEstado ?? data.estado,
      trimestre: e.trimestre ?? data.trimestre,
    }));

    try {
      setTaskUploaded(false);
      await uploadTask(activityPayload, evidencePayloads);
      setTaskUploaded(true);
      reset();
      setSelectedComponentId(null);
      setSelectedResponsables([]);
      setSelectedConcurrencia(null);
      setEvidenceEntries([{ mes: null, trimestre: null, fechaEntrega: null }]);
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
    // removed single selectedMes; we expose entries instead
    selectedEstado,
    setEstado,
    selectedConcurrencia,
    setConcurrencia,
    // nuevo: exposición de trimestre general
    selectedTrimestre,
    setTrimestre,
    isUploadingActivity,
    isUploadingEvidence,
    error,
    taskUploaded,
    onSubmit,
    trimestres,
    // new exports for multiple entries
    evidenceEntries,
    setEntryMes,
    setEntryTrimestre,
  };
}

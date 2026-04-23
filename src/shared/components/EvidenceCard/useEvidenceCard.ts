import { useRef, useState } from "react";
import type { IEvidence } from "../../../core/tasks/domain/upload-evidence/upload-evidence.res";
import { useTasksStore } from "@/store/tasks.store";
import { toast } from "sonner";

export function useEvidenceCard(evidence: IEvidence) {
  const { updateEvidence, updatingEvidenceIds } = useTasksStore();
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState(evidence.estado);
  const [entregadoEn, setEntregadoEn] = useState(evidence.entregadoEn ?? null);
  const [justificacion, setJustificacion] = useState<string | null>(
    (evidence as any).justificacion ?? null
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedJustificacion, setSelectedJustificacion] = useState<string>("");

  const isSubmittingRef = useRef(false);

  const loading = (updatingEvidenceIds || []).includes(evidence._id);

  const isNoLogro = pendingEstado?.trim().toLowerCase() === "no logro";

  const isEntregaExtemporaneaPorFecha = () => {
    if (!selectedDate || !evidence.fechaEntrega) return false;
    const delivered = new Date(selectedDate);
    const due = new Date(evidence.fechaEntrega);
    if (isNaN(delivered.getTime()) || isNaN(due.getTime())) return false;
    delivered.setHours(0, 0, 0, 0);
    due.setHours(0, 0, 0, 0);
    return delivered.getTime() > due.getTime();
  };

  const handleChangeEstado = async (nuevoEstado: string) => {
    const s = (nuevoEstado || "").trim().toLowerCase();
    if (
      s === "entregada" ||
      s === "entrega extemporanea" ||
      s === "entrega extemporánea"
    ) {
      setPendingEstado(nuevoEstado);
      setModalOpen(true);
      setSelectedDate("");
      return;
    }

    if (s === "no logro") {
      setPendingEstado(nuevoEstado);
      setModalOpen(true);
      setSelectedJustificacion("");
      return;
    }

    await doUpdateEstado(nuevoEstado);
  };

  const doUpdateEstado = async (
    nuevoEstado: string,
    fechaEntrega?: string,
    justificacionParam?: string
  ) => {
    setError(null);
    try {
      const rawEstado = normalizarEstado(nuevoEstado);

      const estadoFinal =
        requiereFecha(rawEstado) && fechaEntrega
          ? computeEntregaEstado(rawEstado, fechaEntrega, evidence.fechaEntrega)
          : rawEstado;

      const payload: any = {
        id: evidence._id,
        estado: estadoFinal,
      };

      if (requiereFecha(estadoFinal) && fechaEntrega) {
        payload.entregadoEn = fechaEntrega;
      }

      if (justificacionParam) {
        payload.justificacion = justificacionParam;
      }

      await updateEvidence(payload);

      setEstado(payload.estado);
      if (payload.entregadoEn) setEntregadoEn(payload.entregadoEn);
      else if (!requiereFecha(payload.estado)) setEntregadoEn(null);

      if (payload.justificacion) setJustificacion(payload.justificacion);
      else if (!requiereJustificacion(payload.estado)) setJustificacion(null);

      toast.success("Estado actualizado");
    } catch (err: any) {
      setError(err?.message || "Error al actualizar estado");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleModalConfirm = async () => {
    if (isSubmittingRef.current) return;
    if (isNoLogro) {
      if (!selectedJustificacion || selectedJustificacion.trim().length === 0) return;
      isSubmittingRef.current = true;
      setModalOpen(false);
      await doUpdateEstado(pendingEstado, undefined, selectedJustificacion.trim());
      setPendingEstado(null);
      setSelectedJustificacion("");
      return;
    }

    if (!selectedDate) return;
    if (isEntregaExtemporaneaPorFecha()) {
      if (!selectedJustificacion || selectedJustificacion.trim().length === 0) return;
    }
    isSubmittingRef.current = true;
    setModalOpen(false);
    await doUpdateEstado(
      pendingEstado!,
      selectedDate,
      isEntregaExtemporaneaPorFecha() ? selectedJustificacion.trim() : undefined
    );
    setPendingEstado(null);
    setSelectedDate("");
    setSelectedJustificacion("");
  };

  const modalTitle = isNoLogro
    ? "Ingrese la justificación"
    : isEntregaExtemporaneaPorFecha()
      ? "Selecciona la fecha y justificación"
      : "Selecciona la fecha de entrega";

  const maxDate = new Date().toISOString().split("T")[0];

  return {
    error,
    estado,
    entregadoEn,
    justificacion,
    modalOpen,
    pendingEstado,
    selectedDate,
    selectedJustificacion,
    loading,
    isNoLogro,
    maxDate,
    modalTitle,
    isEntregaExtemporaneaPorFecha,
    setModalOpen,
    setPendingEstado,
    setSelectedDate,
    setSelectedJustificacion,
    handleChangeEstado,
    handleModalConfirm,
  };
}

function normalizarEstado(s: string) {
  const t = s.trim().toLowerCase();
  if (t === "entrega extemporanea" || t === "entrega extemporánea")
    return "Entrega Extemporanea";
  if (t === "no logro") return "No logro";
  if (t === "entregada") return "Entregada";
  if (t === "por entregar") return "Por entregar";
  if (t === "entrega futura") return "Entrega Futura";
  return s;
}

function requiereFecha(est: string) {
  const e = est.toLowerCase();
  return (
    e === "entregada" || e === "entrega extemporanea" || e === "entrega extemporánea"
  );
}

function requiereJustificacion(est: string) {
  const e = est.trim().toLowerCase();
  return e === "no logro" || e === "entrega extemporanea" || e === "entrega extemporánea";
}

function computeEntregaEstado(
  estadoSeleccionado: string,
  fechaEntregada: string | undefined,
  fechaLimite: string | undefined
) {
  if (
    !fechaEntregada ||
    !fechaLimite ||
    !(
      estadoSeleccionado === "Entregada" ||
      estadoSeleccionado === "Entrega Extemporanea"
    )
  )
    return estadoSeleccionado;

  const delivered = new Date(fechaEntregada);
  const due = new Date(fechaLimite);
  if (isNaN(delivered.getTime()) || isNaN(due.getTime()))
    return estadoSeleccionado;

  delivered.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (delivered.getTime() > due.getTime()) return "Entrega Extemporanea";
  return "Entregada";
}

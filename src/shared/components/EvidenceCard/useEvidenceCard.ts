import { useRef, useState, useEffect } from "react";
import type { IEvidence } from "../../../core/tasks/domain/upload-evidence/upload-evidence.res";
import { useTasksStore } from "@/store/tasks.store";
import { useUsersStore } from "@/store/users.store";
import { USERS_2025_IDS } from "@/config/config";
import { toast } from "sonner";
import { User } from "@/core/users/domain/get-all-users";

export function useEvidenceCard(evidence: IEvidence) {
  const {
    updateEvidence,
    updatingEvidenceIds,
    updateEvidenceResponsables,
    patchEvidenceInStore,
  } = useTasksStore();
  const { users, isLoading: isLoadingUsers, getAllUsers } = useUsersStore();
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState(evidence.estado);
  const [entregadoEn, setEntregadoEn] = useState(evidence.entregadoEn ?? null);
  const [justificacion, setJustificacion] = useState<string | null>(
    (evidence as any).justificacion ?? null
  );
  const [responsables, setResponsables] = useState(evidence.responsables || []);
  const [responsablesModalOpen, setResponsablesModalOpen] = useState(false);
  const [confirmResponsablesModalOpen, setConfirmResponsablesModalOpen] =
    useState(false);
  const [confirmAction, setConfirmAction] = useState<"cancel" | "save" | null>(
    null
  );
  const [availableResponsables, setAvailableResponsables] = useState<User[]>([]);
  const [selectedResponsables, setSelectedResponsables] = useState<User[]>([]);

  // Carga usuarios si aún no están disponibles (ej: navegación directa a /evidences)
  useEffect(() => {
    if (!users || users.length === 0) {
      getAllUsers();
    }
  }, []);

  // Derivado: solo muestra carga mientras no hay usuarios y el store está cargando
  const isLoadingResponsables = isLoadingUsers && users.length === 0;

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

  const openResponsablesModal = () => {
    setError(null);
    // Solo usuarios del equipo 2026 (excluye los de 2025 por USERS_2025_IDS)
    const users2026 = users.filter((u) => !USERS_2025_IDS.has(u._id));
    setAvailableResponsables(users2026);
    setSelectedResponsables(responsables);
    setResponsablesModalOpen(true);
  };

  const handleAddResponsable = (user: User) => {
    setSelectedResponsables((prev) => {
      if (prev.some((u) => u._id === user._id)) return prev;
      return [...prev, user];
    });
  };

  const handleRemoveResponsable = (userId: string) => {
    setSelectedResponsables((prev) => prev.filter((u) => u._id !== userId));
  };

  const askConfirmCancelResponsables = () => {
    setConfirmAction("cancel");
    setConfirmResponsablesModalOpen(true);
  };

  const askConfirmSaveResponsables = () => {
    if (selectedResponsables.length === 0) {
      toast.error("Debe existir al menos un encargado para guardar");
      return;
    }
    setConfirmAction("save");
    setConfirmResponsablesModalOpen(true);
  };

  const handleConfirmResponsablesAction = async () => {
    if (confirmAction === "cancel") {
      setConfirmResponsablesModalOpen(false);
      setResponsablesModalOpen(false);
      setSelectedResponsables([]);
      return;
    }

    if (confirmAction === "save") {
      try {
        await updateEvidenceResponsables({
          id: evidence._id,
          responsables: selectedResponsables.map((u) => u._id),
        });

        patchEvidenceInStore?.({
          _id: evidence._id,
          responsables: selectedResponsables,
        } as IEvidence);

        setResponsables(selectedResponsables);
        setResponsablesModalOpen(false);
        setConfirmResponsablesModalOpen(false);
        toast.success("Responsables actualizados");
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Error al actualizar responsables"
        );
      }
    }
  };

  const confirmModalTitle =
    confirmAction === "cancel"
      ? "Confirmar cancelación"
      : "Confirmar actualización";

  const confirmModalText =
    confirmAction === "cancel"
      ? "¿Deseas cancelar los cambios de responsables?"
      : "¿Deseas guardar los responsables seleccionados para esta evidencia?";

  return {
    error,
    estado,
    entregadoEn,
    justificacion,
    responsables,
    modalOpen,
    responsablesModalOpen,
    confirmResponsablesModalOpen,
    confirmAction,
    pendingEstado,
    selectedDate,
    selectedJustificacion,
    loading,
    availableResponsables,
    selectedResponsables,
    isLoadingResponsables,
    isNoLogro,
    maxDate,
    modalTitle,
    confirmModalTitle,
    confirmModalText,
    isEntregaExtemporaneaPorFecha,
    setModalOpen,
    setPendingEstado,
    setSelectedDate,
    setSelectedJustificacion,
    setResponsablesModalOpen,
    setConfirmResponsablesModalOpen,
    handleChangeEstado,
    handleModalConfirm,
    openResponsablesModal,
    handleAddResponsable,
    handleRemoveResponsable,
    askConfirmCancelResponsables,
    askConfirmSaveResponsables,
    handleConfirmResponsablesAction,
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

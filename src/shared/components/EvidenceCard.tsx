import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Chip,
  Avatar,
  Button,
} from "@heroui/react";
import { CalendarDays, Target, Users, FileText } from "lucide-react";
import type { IEvidence } from "../../core/tasks/domain/upload-evidence/upload-evidence.res";
import { ESTADOS } from "@/pages/evidences/upload/options/estados";
import { useTasksStore } from "@/store/tasks.store";
import { useState, useRef } from "react";
import { toast } from "sonner";
import Modal from "./Modal";

interface EvidenceCardProps {
  evidence: IEvidence;
}

const getStatusColor = (estado: string) => {
  if (!estado) return "default";
  const s = estado.trim().toLowerCase();
  switch (s) {
    case "entregada":
      return "success";
    case "entrega futura":
      return "default";
    case "por entregar":
      return "danger";
    case "entrega extemporanea":
      return "warning";
    case "no logro":
      return "secondary";
  }
};

const getInitials = (nombre: string) => {
  return nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

const getMonthName = (mes: number) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[mes - 1] || "Mes inválido";
};

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const { updateEvidence, getAllEvidences } = useTasksStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState(evidence.estado);
  const [entregadoEn, setEntregadoEn] = useState(evidence.entregadoEn ?? null);

  // Nuevo estado para justificación (si existe)
  const [justificacion, setJustificacion] = useState<string | null>(
    (evidence as any).justificacion ?? null
  );

  // Modal para seleccionar fecha de entrega o ingresar justificación
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingEstado, setPendingEstado] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedJustificacion, setSelectedJustificacion] = useState<string>("");

  // Para evitar doble submit
  const isSubmittingRef = useRef(false);

  const handleChangeEstado = async (nuevoEstado: string) => {
    const s = (nuevoEstado || "").trim().toLowerCase();
    // Si el nuevo estado requiere fecha de entrega, abrir modal
    if (
      s === "entregada" ||
      s === "entrega extemporanea" ||
      s === "entrega extemporánea" // por si acaso
    ) {
      setPendingEstado(nuevoEstado);
      setModalOpen(true);
      setSelectedDate(""); // limpiar fecha previa
      return;
    }

    // Si el nuevo estado es "no logro", abrir modal para justificar
    if (s === "no logro" || s === "no logro") {
      setPendingEstado(nuevoEstado);
      setModalOpen(true);
      setSelectedJustificacion("");
      return;
    }

    // Otros estados: actualizar directo
    await doUpdateEstado(nuevoEstado);
  };

  const doUpdateEstado = async (
    nuevoEstado: string,
    fechaEntrega?: string,
    justificacionParam?: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const payload: any = {
        id: evidence._id,
        estado: nuevoEstado,
      };
      if (
        (nuevoEstado === "Entregada" ||
          nuevoEstado === "Entrega Extemporanea" ||
          nuevoEstado === "Entrega extemporanea" ||
          nuevoEstado === "Entrega Extemporánea") &&
        fechaEntrega
      ) {
        payload.entregadoEn = fechaEntrega;
      }
      if (justificacionParam) {
        payload.justificacion = justificacionParam;
      }

      const res = await updateEvidence(payload);
      setEstado(nuevoEstado);

      // Si la respuesta trae nueva fecha de entrega o justificación, actualizarla
      if (res?.data && Array.isArray(res.data)) {
        const updated = res.data.find((ev: IEvidence) => ev._id === evidence._id);
        setEntregadoEn((updated as any)?.entregadoEn ?? null);
        setJustificacion((updated as any)?.justificacion ?? null);
      } else if (res?.data) {
        setEntregadoEn((res.data as any)?.entregadoEn ?? null);
        setJustificacion((res.data as any)?.justificacion ?? null);
      }

      toast.success("Estado actualizado");
      if (typeof getAllEvidences === "function") getAllEvidences();
    } catch (err: any) {
      setError(err?.message || "Error al actualizar estado");
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  };

  // Confirmar desde el modal
  const handleModalConfirm = async () => {
    if (isSubmittingRef.current) return;
    // Si es justificación
    if (pendingEstado && pendingEstado.trim().toLowerCase() === "no logro") {
      if (!selectedJustificacion || selectedJustificacion.trim().length === 0) return;
      isSubmittingRef.current = true;
      setModalOpen(false);
      await doUpdateEstado(pendingEstado, undefined, selectedJustificacion.trim());
      setPendingEstado(null);
      setSelectedJustificacion("");
      return;
    }

    // Si es fecha
    if (!selectedDate) return;
    isSubmittingRef.current = true;
    setModalOpen(false);
    await doUpdateEstado(pendingEstado!, selectedDate);
    setPendingEstado(null);
    setSelectedDate("");
  };

  // Mostrar entregadoEn solo si el estado es Entregada o Entrega extemporánea
  const mostrarEntregadoEn =
    (estado === "Entregada" ||
      estado === "Entrega Extemporanea" ||
      estado === "Entrega extemporanea") &&
    entregadoEn;

  // Calcular fecha máxima para el input date (hoy)
  const maxDate = new Date().toISOString().split("T")[0];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium hover:shadow-large transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 text-balance">
              {evidence.actividad.componente.nombreComponente}
            </h3>
            <p className="text-sm text-default-500 text-pretty truncate line-clamp-5">
              {evidence.actividad.actividad}
            </p>
          </div>
          <Chip
            color={getStatusColor(estado)}
            variant="flat"
            size="sm"
            className="shrink-0"
          >
            {estado}
          </Chip>
        </div>
      </CardHeader>

      <CardBody className="space-y-4">
        {/* Tipo de Evidencia */}
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-default-400" />
          <span className="text-sm font-medium">Tipo:</span>
          <Chip variant="bordered" size="sm">
            {evidence.tipoEvidencia}
          </Chip>
        </div>

        {/* Período y Meta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-default-400" />
            <span className="text-sm text-default-500">Período:</span>
            <span className="text-sm font-medium">
              {getMonthName(evidence.mes)} {evidence.anio}
              {evidence.trimestre ? (
                <span className="text-sm text-default-400 ml-2">
                  · Trimestre {evidence.trimestre}
                </span>
              ) : null}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-default-400" />
            <span className="text-sm text-default-500">Meta Anual:</span>
            <span className="text-sm font-medium">
              {evidence.actividad.metaAnual}
            </span>
          </div>
        </div>

        {/* Responsables */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-default-400" />
            <span className="text-sm font-medium">
              Responsables ({evidence.responsables.length})
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {evidence.responsables.map((responsable) => (
              <div
                key={responsable._id}
                className="flex items-center gap-2 bg-default-100 rounded-lg px-3 py-2"
              >
                <Avatar
                  size="sm"
                  name={getInitials(responsable.nombre)}
                  className="text-xs"
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">
                    {responsable.nombre}
                  </span>
                  <span className="text-xs text-default-500">
                    {responsable.vinculacion}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fechas y Botón */}
        <div className="flex items-center justify-between pt-2 border-t border-divider">
          <div className="flex flex-col gap-1">
            <div className="text-xs text-warning">
              <span>Entrega hasta: {formatDate(evidence.fechaEntrega)}</span>
            </div>
            {mostrarEntregadoEn && (
              <div className="text-xs text-success-600">
                <span>Entregada en: {formatDate(entregadoEn as string)}</span>
              </div>
            )}
            {justificacion && (
              <div className="text-xs text-default-500 mt-1">
                <span>Justificación: {justificacion}</span>
              </div>
            )}
          </div>

          <Dropdown isDisabled={evidence.estado === "Entregada" || evidence.estado === "No logro"}>
            <DropdownTrigger>
              <Button variant="bordered" isLoading={loading} disabled={loading}>
                Cambiar estado
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Cambiar estado">
              {ESTADOS.map((estadoOpt) => (
                <DropdownItem
                  key={estadoOpt.value}
                  onClick={() => handleChangeEstado(estadoOpt.value)}
                  isDisabled={loading || estadoOpt.value === estado}
                >
                  {estadoOpt.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        {error && <div className="text-xs text-red-500 mt-2">{error}</div>}

        {/* Modal para seleccionar fecha de entrega o ingresar justificación */}
        <Modal
          open={modalOpen}
          title={
            pendingEstado && pendingEstado.trim().toLowerCase() === "no logro"
              ? "Ingrese la justificación"
              : "Selecciona la fecha de entrega"
          }
          onClose={() => {
            setModalOpen(false);
            setPendingEstado(null);
            setSelectedDate("");
            setSelectedJustificacion("");
          }}
          footer={
            <div className="flex gap-2 justify-end">
              <Button
                variant="light"
                onClick={() => {
                  setModalOpen(false);
                  setPendingEstado(null);
                  setSelectedDate("");
                  setSelectedJustificacion("");
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="solid"
                color="success"
                onClick={handleModalConfirm}
                disabled={
                  // deshabilitar si no hay fecha o justificación según el caso
                  pendingEstado &&
                  pendingEstado.trim().toLowerCase() === "no logro"
                    ? selectedJustificacion.trim().length === 0
                    : !selectedDate
                }
              >
                Aceptar
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            {pendingEstado && pendingEstado.trim().toLowerCase() === "no logro" ? (
              <label className="text-sm font-medium">
                <span className="text-default-500 mr-2">
                  Justificación (máx. 300 caracteres)
                </span>
                <textarea
                  className="mt-2 border rounded px-3 py-2 w-full resize-y"
                  maxLength={300}
                  rows={5}
                  value={selectedJustificacion}
                  onChange={(e) => setSelectedJustificacion(e.target.value)}
                />
                <div className="text-xs text-default-400 mt-1">
                  {selectedJustificacion.length} / 300
                </div>
              </label>
            ) : (
              <label className="text-sm font-medium">
                <span className="text-default-500 mr-2">Fecha de entrega</span>
                <input
                  type="date"
                  className="mt-2 border rounded px-3 py-2"
                  max={maxDate}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </label>
            )}
            {pendingEstado && pendingEstado.trim().toLowerCase() === "no logro" ? (
              <span className="text-xs text-default-500">
                Debes ingresar la justificación para registrar "No logro".
              </span>
            ) : (
              <span className="text-xs text-default-500">
                No puedes seleccionar una fecha futura.
              </span>
            )}
          </div>
        </Modal>
      </CardBody>
    </Card>
  );
}

import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Chip,
  Button,
} from "@heroui/react";
import { CalendarDays, Target, Users, FileText } from "lucide-react";
import type { IEvidence } from "../../../core/tasks/domain/upload-evidence/upload-evidence.res";
import { ESTADOS } from "@/pages/evidences/upload/options/estados";
import { ProfileAvatar } from "@/shared/components/ProfileAvatar";
import {
  formatDate,
  getMonthName,
  getStatusColor,
} from "@/shared/utils/evidence-card";
import Modal from "../Modal";
import { useEvidenceCard } from "./useEvidenceCard";

interface EvidenceCardProps {
  evidence: IEvidence;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  const {
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
  } = useEvidenceCard(evidence);

  const mostrarEntregadoEn =
    (estado === "Entregada" ||
      estado === "Entrega Extemporanea" ||
      estado === "Entrega extemporanea") &&
    entregadoEn;

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
                <ProfileAvatar
                  name={responsable.nombre}
                  size="sm"
                  imgClassName="w-8 h-8 rounded-full object-cover"
                  avatarClassName="w-8 h-8 text-xs"
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

          <Dropdown >
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
          title={modalTitle}
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
            {isNoLogro ? (
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
              <>
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
                {isEntregaExtemporaneaPorFecha() && (
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
                )}
              </>
            )}
            {isNoLogro ? (
              <span className="text-xs text-default-500">
                Debes ingresar la justificación para registrar No logro.
              </span>
            ) : isEntregaExtemporaneaPorFecha() ? (
              <span className="text-xs text-default-500">
                Debes ingresar la justificación para registrar Entrega extemporanea.
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


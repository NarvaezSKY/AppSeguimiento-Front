import {
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Chip } from "@heroui/react";
import { Avatar } from "@heroui/react";
import { Button } from "@heroui/react";
import { CalendarDays, Target, Users, FileText } from "lucide-react";
import type { IEvidence } from "../../core/tasks/domain/upload-evidence/upload-evidence.res";

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
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
  const handleMarkAsDelivered = () => {
    console.log("[v0] Marking evidence as delivered:", evidence._id);
    // Aquí iría la lógica para marcar como entregada
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium hover:shadow-large transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 text-balance">
              {evidence.componente.componente}
            </h3>
            <p className="text-sm text-default-500 text-pretty truncate line-clamp-5">
              {evidence.componente.actividad}
            </p>
          </div>
          <Chip
            color={getStatusColor(evidence.estado)}
            variant="flat"
            size="sm"
            className="shrink-0"
          >
            {evidence.estado}
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
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-default-400" />
            <span className="text-sm text-default-500">Meta Anual:</span>
            <span className="text-sm font-medium">
              {evidence.componente.metaAnual.toLocaleString()}
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
            <div className="text-xs text-default-500">
              <span>Creado: {formatDate(evidence.creadoEn)}</span>
            </div>
            <div className="text-xs text-default-500">
              <span>Entrega: {formatDate(evidence.fechaEntrega)}</span>
            </div>
          </div>

          <Dropdown>
            <DropdownTrigger>
              <Button variant="bordered">Cambiar estado</Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem key="new">Entregada</DropdownItem>
              <DropdownItem key="copy">Por entregar</DropdownItem>
              <DropdownItem key="edit">Extemporánea</DropdownItem>
              <DropdownItem key="delete">No logro</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </CardBody>
    </Card>
  );
}

import { Card } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

interface Props {
  evidence: any | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Modal simple (sin dependencias adicionales) que usa Card de heroui.
 * Muestra la información completa de la evidencia pasada según la interfaz IEvidence.
 */
export default function EvidenceModal({ evidence, open, onClose }: Props) {
  if (!open || !evidence) return null;

  const fmt = (d?: string) => {
    if (!d) return "-";
    try {
      return new Date(d).toLocaleString();
    } catch {
      return d;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <Card className="z-10 max-w-2xl w-full p-6">
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">
              {evidence.componente?.actividad ?? "Evidencia"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">{evidence.componente?.componente}</p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <Chip color={(evidence.estado || "").toLowerCase().includes("entreg") ? "success" : (evidence.estado || "").toLowerCase().includes("pend") ? "warning" : "default"} className="text-xs">
              {evidence.estado}
            </Chip>
            <span className="text-xs text-gray-500">Entrega: {fmt(evidence.fechaEntrega)}</span>
          </div>
        </header>

        <main className="mt-4 text-sm text-gray-700 space-y-3">
          <div>
            <div className="text-gray-500 text-xs">Meta anual</div>
            <div className="font-medium">{evidence.componente?.metaAnual ?? "—"}</div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">Tipo de evidencia</div>
            <div className="font-medium">{evidence.tipoEvidencia ?? "—"}</div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">Mes / Año</div>
            <div className="font-medium">{evidence.mes ?? "-"} / {evidence.anio ?? "-"}</div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">Responsables</div>
            <ul className="mt-1 space-y-1">
              {Array.isArray(evidence.responsables) && evidence.responsables.length > 0 ? (
                evidence.responsables.map((r: any) => (
                  <li key={r._id} className="text-sm">
                    <div className="font-medium">{r.nombre}</div>
                    <div className="text-xs text-gray-500">{r.email} · {r.vinculacion}</div>
                  </li>
                ))
              ) : (
                <li className="text-sm">—</li>
              )}
            </ul>
          </div>

          <div>
            <div className="text-gray-500 text-xs">Creado en</div>
            <div className="font-medium">{fmt(evidence.creadoEn)}</div>
          </div>

          <div>
            <div className="text-gray-500 text-xs">ID</div>
            <div className="font-mono text-xs text-gray-600">{evidence._id}</div>
          </div>
        </main>

        <footer className="mt-6 flex justify-end gap-2">
          <Button color="default" onClick={onClose}>Cerrar</Button>
        </footer>
      </Card>
    </div>
  );
}
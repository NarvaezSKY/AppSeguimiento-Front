import { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { useTasksStore } from "@/store/tasks.store";
import { ESTADOS } from "@/pages/evidences/upload/options/estados";
import type { IEvidence } from "@/core/tasks/domain/upload-evidence/upload-evidence.res";

/**
 * EstadoGraphics acepta prop `evidences?: IEvidence[]`.
 * Usa clases de HeroUI / tokens (default, primary, secondary, success, warning, danger)
 * para los colores en vez de hex hardcodeados.
 */

const SIZE = 200;
const RADIUS = 80;
const CENTER = SIZE / 2;

const polarToCartesian = (
  cx: number,
  cy: number,
  r: number,
  angleDeg: number
) => {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

/**
 * Devuelve clases de HeroUI / Tailwind para texto y background.
 * - text -> se usa + `fill-current` en el <path> SVG para pintar el slice.
 * - bg -> se usa en la leyenda (dot) como background.
 */
const getColorClassForEstado = (estado: string) => {
  const s = (estado ?? "").toLowerCase();
  if (s.includes("extemporanea")) return { text: "text-warning", bg: "bg-warning" };
  if (s.includes("entregada")) return { text: "text-success", bg: "bg-success" };
  if (s.includes("por entregar") || s.includes("porentregar")) return { text: "text-danger", bg: "bg-danger" };
  if (s.includes("no logro") || s.includes("nologo")) return { text: "text-secondary", bg: "bg-secondary" };
  // fallback -> primary
  return { text: "text-success", bg: "bg-success" };
};

export default function EstadoGraphics({
  evidences: propEvidences,
}: {
  evidences?: IEvidence[];
}) {
  // fallback al store si no se pasan evidencias por prop
  const storeEvidences = useTasksStore((s) => s.evidences ?? []);
  const evidences = propEvidences ?? storeEvidences;

  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    ESTADOS.forEach((opt) => {
      counts[opt.value] = 0;
    });

    for (const ev of evidences) {
      const key = ev.estado ?? "Sin estado";
      if (typeof counts[key] === "number") counts[key] += 1;
      else counts[key] = (counts[key] || 0) + 1;
    }

    const items = Object.keys(counts).map((k) => {
      const colorClass = getColorClassForEstado(k);
      return {
        key: k,
        label: ESTADOS.find((e) => e.value === k)?.label ?? k,
        value: counts[k],
        colorClass,
      };
    });

    const total = items.reduce((s, it) => s + it.value, 0);
    let start = 0;
    const withAngles = items.map((it) => {
      const angle = total === 0 ? 0 : (it.value / total) * 360;
      const slice = {
        ...it,
        startAngle: start,
        endAngle: start + angle,
      };
      start += angle;
      return slice;
    });

    return { items: withAngles, total };
  }, [evidences]);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <h3 className="text-lg font-semibold">Distribución por estado</h3>
      </CardHeader>
      <CardBody>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <svg
              width={SIZE}
              height={SIZE}
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label="Gráfico de estados"
            >
              <title>Distribución de evidencias por estado</title>
              {data.total === 0 ? (
                <circle cx={CENTER} cy={CENTER} r={RADIUS} className="text-default-300 fill-current" />
              ) : (
                data.items
                  .filter((it) => it.value > 0)
                  .map((it) => (
                    <path
                      key={it.key}
                      d={describeArc(
                        CENTER,
                        CENTER,
                        RADIUS,
                        it.startAngle,
                        it.endAngle
                      )}
                      // usar clase de texto + fill-current para pintar con el token de color
                      className={`${it.colorClass.text} fill-current`}
                    />
                  ))
              )}
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS * 0.45}
                className="text-default-0 fill-current"
              />
            </svg>
          </div>

          <div className="w-full md:w-1/2">
            <div className="grid grid-cols-1 gap-2">
              {data.items
                .filter((it) => it.value > 0)
                .map((it) => (
                  <div
                    key={it.key}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`${it.colorClass.bg} w-3 h-3 rounded-full shrink-0`}
                        aria-hidden
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {it.label}
                        </div>
                        <div className="text-xs text-default-500 truncate">
                          {it.value} evidencia{it.value !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {((it.value / Math.max(1, data.total)) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}

              {data.total === 0 && (
                <div className="text-sm text-default-500">
                  No hay evidencias registradas.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

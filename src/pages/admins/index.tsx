import DefaultLayout from "@/layouts/default";
import { getProfileImage } from "@/shared/utils/profile-images";
import { Chip } from "@heroui/react";
import { useNavigate } from "react-router-dom";

interface AdminEntry {
  name: string;
  role: string;
  badge: string;
  badgeColor: "default" | "success" | "primary";
  period: string;
  isCurrent: boolean;
  userId: string;
}

interface CoordinatorEntry {
  name: string;
  role: string;
  badge: string;
  userId: string;
}

const ADMINS: AdminEntry[] = [
  {
    name: "Edith Betancourt Sánchez",
    role: "Administradora del Sistema",
    badge: "Primer Administrador",
    badgeColor: "default",
    period: "Septiembre 2, 2025  –  Mayo 5, 2026",
    isCurrent: false,
    userId: "68ba073327e5ac74d4a55726",
  },
  {
    name: "Rodrigo Alberto Montaño Fuentes",
    role: "Administrador del Sistema",
    badge: "Administrador Actual",
    badgeColor: "success",
    period: "Mayo 5, 2026  –  Actualidad",
    isCurrent: true,
    userId: "68ba07ef27e5ac74d4a55736",
  },
];

const COORDINATORS: CoordinatorEntry[] = [
  {
    name: "Julián Andrés Garcés Muñoz",
    role: "Coordinador Misional Regional",
    badge: "Rol Administrativo",
    userId: "68ba075327e5ac74d4a5572a",
  },
];

function TimelineAvatar({
  name,
  isCurrent,
}: {
  name: string;
  isCurrent: boolean;
}) {
  const img = getProfileImage(name);
  return (
    <div
      className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-4 ${
        isCurrent ? "border-success shadow-md shadow-success/30" : "border-default-300"
      }`}
    >
      {img ? (
        <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-default-200 flex items-center justify-center text-2xl font-bold text-default-600">
          {name.charAt(0)}
        </div>
      )}
    </div>
  );
}

export default function TrazabilidadPage() {
  const navigate = useNavigate();
  return (
    <DefaultLayout>
      <section className="max-w-2xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Trazabilidad de Administradores</h1>
          <p className="text-default-500 mt-1 text-sm">
            Historial de administración del Sistema de Seguimiento CMR — Regional Cauca
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-default-200" />

          <div className="flex flex-col gap-8">
            {ADMINS.map((admin, i) => (
              <div key={i} className="flex items-start gap-6 relative">
                <TimelineAvatar name={admin.name} isCurrent={admin.isCurrent} />

                <button
                  type="button"
                  onClick={() => navigate(`/users/${admin.userId}`)}
                  className={`flex-1 rounded-2xl border p-5 shadow-sm transition-all cursor-pointer text-left hover:opacity-80 ${
                    admin.isCurrent
                      ? "border-success/40 bg-success/5 dark:bg-success/10"
                      : "border-default-200 bg-content1"
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <div>
                      <h3 className="text-base font-bold leading-tight">{admin.name}</h3>
                      <p className="text-default-500 text-xs mt-0.5">{admin.role}</p>
                    </div>
                    <Chip
                      color={admin.badgeColor}
                      variant={admin.isCurrent ? "solid" : "flat"}
                      size="sm"
                      className={admin.isCurrent ? "text-white" : ""}
                    >
                      {admin.badge}
                    </Chip>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        admin.isCurrent ? "bg-success animate-pulse" : "bg-default-400"
                      }`}
                    />
                    <span className="text-sm text-default-600 font-medium">
                      {admin.period}
                    </span>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Separador */}
        <div className="my-10 flex items-center gap-4">
          <div className="flex-1 h-px bg-default-200" />
          <span className="text-default-400 text-xs font-semibold uppercase tracking-wider">
            Roles Administrativos
          </span>
          <div className="flex-1 h-px bg-default-200" />
        </div>

        {/* Coordinadores */}
        <div className="flex flex-col gap-4">
          {COORDINATORS.map((c, i) => {
            const img = getProfileImage(c.name);
            return (
              <button
                key={i}
                type="button"
                onClick={() => navigate(`/users/${c.userId}`)}
                className="flex items-center gap-5 w-full bg-content1 rounded-2xl border border-primary/30 p-5 shadow-sm cursor-pointer text-left hover:opacity-80"
              >
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-4 border-primary shadow-md shadow-primary/20">
                  {img ? (
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-default-200 flex items-center justify-center text-2xl font-bold text-default-600">
                      {c.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold truncate">{c.name}</h3>
                  <p className="text-default-500 text-xs mt-0.5">{c.role}</p>
                </div>
                <Chip color="primary" variant="flat" size="sm">
                  {c.badge}
                </Chip>
              </button>
            );
          })}
        </div>
      </section>
    </DefaultLayout>
  );
}

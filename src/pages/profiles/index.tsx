import { useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { EvidenceCard } from "@/shared/components/EvidenceCard";
import { ESTADOS } from "../evidences/upload/options/estados";
import { trimestres } from "../evidences/upload/options/meses";
import {
  Card,
  CardHeader,
  Avatar,
  Chip,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import EstadoGraphics from "./Components/estadoGraphics";
import { Divider } from "@heroui/react";
import useProfile from "./hooks/useProfile";
import pfpEdith from "../../assets/profiles/Edith.png";
import pfpJuian from "../../assets/profiles/Inge Julian.png";
import pfpRodrigo from "../../assets/profiles/Rodrigo.png";
import pfpDiego from "../../assets/profiles/Diego.png";

const PROFILE_IMAGES: Record<string, { src: string; alt: string }> = {
  "Edith Betancourt Sánchez": { src: pfpEdith, alt: "Edith Betancourt" },
  "Julián Andrés Garcés Muñoz": { src: pfpJuian, alt: "Julián Andrés Garcés" },
  "Rodrigo Alberto Montaño Fuentes": {
    src: pfpRodrigo,
    alt: "Rodrigo Alberto Montaño",
  },
  "Diego Arley Arias Guzman": {
    src: pfpDiego,
    alt: "Diego Arley Arias Guzman",
  },
};

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();

  const {
    user,
    userEvidences,
    effectiveComponent,
    effectiveComponentLabel,
    componentOptions,
    selectComponent,
    selectedActivity,
    selectedActivityLabel,
    activityOptions,
    selectActivity,
    selectedEstado,
    setSelectedEstado,
    selectedTrimestre,
    setSelectedTrimestre,
    isLoading,
  } = useProfile(userId ?? null);

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <span className="text-lg text-gray-500">Usuario no encontrado.</span>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="max-w-4xl mx-auto py-10 flex flex-col gap-8">
        {/* Datos del usuario */}
        <Card className="w-full">
          <CardHeader className="flex items-center gap-4">
            {PROFILE_IMAGES[user.nombre] ? (
              <img
                src={PROFILE_IMAGES[user.nombre].src}
                alt={PROFILE_IMAGES[user.nombre].alt}
                className="w-32 h-32 rounded-full object-cover border-4 border-secondary"
              />
            ) : (
              <Avatar name={user.nombre} size="lg" />
            )}
            <div>
              <h2 className="text-3xl font-bold">{user.nombre}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Chip color="primary" className="text-white" size="sm">
                  {user.vinculacion}
                </Chip>
                <span className="text-gray-500 text-sm">{user.email}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Filtros: ahora los títulos están dentro de cada Dropdown para ahorrar espacio */}
        <div className="flex items-center gap-4 flex-wrap">
          <Dropdown>
            <DropdownTrigger>
              <button
                className="px-3 py-2 border rounded flex items-center gap-2 min-w-[200px]"
                title={effectiveComponent?.nombreComponente}
              >
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500 leading-none">
                    Componente
                  </div>
                  <div className="truncate">{effectiveComponentLabel}</div>
                </div>
                <span className="text-sm opacity-70">▼</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por componente"
              items={[
                { value: "all-comp", label: "Todos" },
                ...componentOptions,
              ]}
              onAction={(key) =>
                selectComponent(key === "all-comp" ? null : String(key))
              }
            >
              {(item) => (
                <DropdownItem key={item.value} title={item.label}>
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button
                className="px-3 py-2 border rounded flex items-center gap-2 min-w-[220px]"
                title={selectedActivity?.actividad}
              >
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500 leading-none">
                    Actividad
                  </div>
                  <div className="truncate">{selectedActivityLabel}</div>
                </div>
                <span className="text-sm opacity-70">▼</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por actividad"
              items={[
                { value: "all-act", label: "Todas las actividades" },
                ...activityOptions,
              ]}
              onAction={(key) =>
                selectActivity(key === "all-act" ? null : String(key))
              }
            >
              {(item) => (
                <DropdownItem key={item.value} title={item.label}>
                  {item.label}
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[160px]">
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500 leading-none">
                    Estado
                  </div>
                  <div>{selectedEstado ? selectedEstado : "Todos"}</div>
                </div>
                <span className="text-sm opacity-70">▼</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por estado"
              items={[{ value: "all", label: "Todos" }, ...ESTADOS]}
              onAction={(key) =>
                setSelectedEstado(key === "all" ? null : String(key))
              }
            >
              {(item) => (
                <DropdownItem key={item.value}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[200px]">
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500 leading-none">
                    Trimestre
                  </div>
                  <div className="truncate">
                    {selectedTrimestre
                      ? trimestres.find((t) => t.value === selectedTrimestre)
                          ?.label
                      : "Todos los trimestres"}
                  </div>
                </div>
                <span className="text-sm opacity-70">▼</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Filtrar por trimestre"
              items={[{ value: "all-trim", label: "Todos" }, ...trimestres]}
              onAction={(key) =>
                setSelectedTrimestre(key === "all-trim" ? null : Number(key))
              }
            >
              {(item) => (
                <DropdownItem key={item.value}>{item.label}</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              Cargando evidencias...
            </div>
          ) : userEvidences.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              No hay evidencias para este usuario.
            </div>
          ) : (
            userEvidences.map((ev) => (
              <EvidenceCard key={ev._id} evidence={ev} />
            ))
          )}
        </div>
        <Divider />
        <EstadoGraphics evidences={userEvidences} />
      </section>
    </DefaultLayout>
  );
}

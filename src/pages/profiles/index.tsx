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
            <Avatar name={user.nombre} size="lg" />
            <div>
              <h2 className="text-2xl font-bold">{user.nombre}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Chip color="primary" size="sm">
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
            <DropdownMenu aria-label="Filtrar por componente">
              <DropdownItem
                key="all-comp"
                onClick={() => selectComponent(null)}
                title="Todos"
              >
                Todos
              </DropdownItem>
              <>
                {componentOptions.map((opt) => (
                  <DropdownItem
                    key={opt.value}
                    onClick={() => selectComponent(opt.value)}
                    title={opt.label}
                  >
                    {opt.label}
                  </DropdownItem>
                ))}
              </>
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
            <DropdownMenu aria-label="Filtrar por actividad">
              <DropdownItem key="all-act" onClick={() => selectActivity(null)}>
                Todas las actividades
              </DropdownItem>
              <>
                {activityOptions.map((opt) => (
                  <DropdownItem
                    key={opt.value}
                    onClick={() => selectActivity(opt.value)}
                    title={opt.label}
                  >
                    {opt.label}
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[160px]">
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500 leading-none">Estado</div>
                  <div>{selectedEstado ? selectedEstado : "Todos"}</div>
                </div>
                <span className="text-sm opacity-70">▼</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Filtrar por estado">
              <DropdownItem key="all" onClick={() => setSelectedEstado(null)}>
                Todos
              </DropdownItem>
              <>
                {ESTADOS.map((estado) => (
                  <DropdownItem
                    key={estado.value}
                    onClick={() => setSelectedEstado(estado.value)}
                  >
                    {estado.label}
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>

          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[200px]">
                <div className="flex-1 text-left">
                  <div className="text-xs text-gray-500 leading-none">Trimestre</div>
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
            <DropdownMenu aria-label="Filtrar por trimestre">
              <DropdownItem
                key="all-trim"
                onClick={() => setSelectedTrimestre(null)}
              >
                Todos
              </DropdownItem>
              <>
                {trimestres.map((tr) => (
                  <DropdownItem
                    key={tr.value}
                    onClick={() => setSelectedTrimestre(tr.value)}
                  >
                    {tr.label}
                  </DropdownItem>
                ))}
              </>
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

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useUsersStore } from "@/store/users.store";
import { useTasksStore } from "@/store/tasks.store";
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
import { truncate } from "./utils/truncate";
import mapActivitiesToOptions from "./utils/actividades";
import mapComponentsToOptions from "./utils/componentes";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { users, getAllUsers } = useUsersStore();

  const {
    evidences,
    getAllEvidences,
    isLoading,
    lastComponentId,
    components,
    getComponents,
    getActividadesByResponsable,
    activitiesInProfile,
  } = useTasksStore();

  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedTrimestre, setSelectedTrimestre] = useState<number | null>(
    null
  );

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null
  );

  const selectActivity = (id: string | null) => {
    setSelectedActivityId(id);
  };

  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(
    null
  );
  const [manualComponentSelection, setManualComponentSelection] =
    useState(false);

  const selectComponent = (id: string | null) => {
    setSelectedComponentId(id);
    setManualComponentSelection(true);
  };

  useEffect(() => {
    getComponents?.().catch(() => {});
  }, [getComponents]);

  useEffect(() => {
    if (!userId) return;

    getActividadesByResponsable?.(userId).catch(() => {});
  }, [userId, getActividadesByResponsable]);

  useEffect(() => {
    if (!selectedActivityId) return;
    const exists = activitiesInProfile?.some(
      (a: any) => a._id === selectedActivityId
    );
    if (!exists) setSelectedActivityId(null);
  }, [activitiesInProfile, selectedActivityId]);

  useEffect(() => {
    if (!users || users.length === 0) getAllUsers();

    const effectiveComponentId =
      manualComponentSelection || selectedComponentId
        ? selectedComponentId
        : (lastComponentId ?? null);

    const query: Record<string, any> = {};
    if (userId) query.responsable = userId;
    if (selectedEstado) query.estado = selectedEstado;
    if (selectedTrimestre !== null && selectedTrimestre !== undefined)
      query.trimestre = Number(selectedTrimestre);
    if (effectiveComponentId) query.componente = effectiveComponentId;

    if (selectedActivityId) query.actividad = selectedActivityId;

    getAllEvidences(query).catch(() => {});
  }, [
    userId,
    selectedEstado,
    selectedTrimestre,
    selectedComponentId,
    manualComponentSelection,
    lastComponentId,
    getAllEvidences,
    getAllUsers,
    users,
    selectedActivityId,
  ]);

  const user = useMemo(
    () => users?.find((u) => u._id === userId),
    [users, userId]
  );

  const userEvidences = useMemo(() => {
    if (!user) return [];
    return (
      evidences?.filter((ev) =>
        ev.responsables?.some((r: any) => r._id === user._id)
      ) || []
    );
  }, [evidences, user]);

  if (!user) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <span className="text-lg text-gray-500">Usuario no encontrado.</span>
        </div>
      </DefaultLayout>
    );
  }

  const effectiveComponentId =
    manualComponentSelection || selectedComponentId
      ? selectedComponentId
      : (lastComponentId ?? null);

  // etiquetas truncadas para mostrar en los botones y en los items (con title para tooltip)
  const effectiveComponent = (components ?? []).find(
    (c: any) => c._id === effectiveComponentId
  );
  const effectiveComponentLabel = effectiveComponent
    ? truncate(effectiveComponent.nombreComponente)
    : "Todos";

  const selectedActivity = activitiesInProfile?.find(
    (a: any) => a._id === selectedActivityId
  );
  const selectedActivityLabel = selectedActivity
    ? truncate(selectedActivity.actividad)
    : "Todas las actividades";

  const activityOptions = mapActivitiesToOptions(activitiesInProfile ?? [], 80);

  const componentOptions = mapComponentsToOptions(components ?? [], 50);

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

        {/* Filtros: Componente + Estado + Trimestre + Actividad */}
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-medium">Componente:</span>
          <Dropdown>
            <DropdownTrigger>
              <button
                className="px-3 py-2 border rounded flex items-center gap-2 min-w-[200px]"
                title={effectiveComponent?.nombreComponente}
              >
                {effectiveComponentLabel}
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

          <span className="font-medium">Actividad:</span>
          <Dropdown>
            <DropdownTrigger>
              <button
                className="px-3 py-2 border rounded flex items-center gap-2 min-w-[220px]"
                title={selectedActivity?.actividad}
              >
                {selectedActivityLabel}
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

          <span className="font-medium">Estado:</span>
          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[160px]">
                {selectedEstado ? selectedEstado : "Todos"}
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

          <span className="font-medium">Trimestre:</span>
          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[200px]">
                {selectedTrimestre
                  ? trimestres.find((t) => t.value === selectedTrimestre)?.label
                  : "Todos los trimestres"}
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

        {/* Evidencias */}
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

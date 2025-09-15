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

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { users, getAllUsers } = useUsersStore();

  // get components + lastComponentId from store
  const {
    evidences,
    getAllEvidences,
    isLoading,
    lastComponentId,
    components,
    getComponents,
  } = useTasksStore();

  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);
  const [selectedTrimestre, setSelectedTrimestre] = useState<number | null>(null);

  // selected component filter (editable). Don't force overwrite user's choice:
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
  const [manualComponentSelection, setManualComponentSelection] = useState(false);

  // helper to set component from UI (marks selection as manual so auto-default won't override)
  const selectComponent = (id: string | null) => {
    setSelectedComponentId(id);
    setManualComponentSelection(true);
  };

  // ensure components are loaded
  useEffect(() => {
    getComponents?.().catch(() => { });
  }, [getComponents]);

  useEffect(() => {
    if (!users || users.length === 0) getAllUsers();

    // if lastComponentId exists and user didn't pick manually, we don't overwrite selectedComponentId
    // here compute the effective component to use for queries (prefer manual selectedComponentId,
    // otherwise fall back to lastComponentId)
    const effectiveComponentId =
      manualComponentSelection || selectedComponentId
        ? selectedComponentId
        : lastComponentId ?? null;

    const query: Record<string, any> = {};
    if (userId) query.responsable = userId;
    if (selectedEstado) query.estado = selectedEstado;
    if (selectedTrimestre !== null && selectedTrimestre !== undefined)
      query.trimestre = Number(selectedTrimestre);
    if (effectiveComponentId) query.componente = effectiveComponentId;

    getAllEvidences(query).catch(() => { });
    // keep dependencies minimal but include flags that affect effectiveComponentId
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

  // display uses same effectiveComponentId logic so label matches el filtro aplicado
  const effectiveComponentId =
    manualComponentSelection || selectedComponentId
      ? selectedComponentId
      : lastComponentId ?? null;

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

        {/* Filtros: Componente + Estado + Trimestre */}
        <div className="flex items-center gap-4">
          <span className="font-medium">Componente:</span>
          <Dropdown>
            <DropdownTrigger>
              <button className="px-3 py-2 border rounded flex items-center gap-2 min-w-[200px]">
                {effectiveComponentId
                  ? (components ?? []).find((c: any) => c._id === effectiveComponentId)
                    ?.nombreComponente ?? "Seleccionado"
                  : "Todos"}
                <span className="text-sm opacity-70">▼</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Filtrar por componente">
              <DropdownItem key="all-comp" onClick={() => selectComponent(null)}>
                Todos
              </DropdownItem>
              <>
                {components?.map((c: any) => (
                  <DropdownItem key={c._id} onClick={() => selectComponent(c._id)}>
                    {c.nombreComponente}
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>

          <span className="font-medium">Filtrar evidencias por estado:</span>
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

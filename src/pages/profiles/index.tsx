import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DefaultLayout from "@/layouts/default";
import { useUsersStore } from "@/store/users.store";
import { useTasksStore } from "@/store/tasks.store";
import { EvidenceCard } from "@/shared/components/EvidenceCard";
import { ESTADOS } from "../evidences/upload/options/estados";
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

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { users, getAllUsers } = useUsersStore();
  const { evidences, getAllEvidences, isLoading } = useTasksStore();
  const [selectedEstado, setSelectedEstado] = useState<string | null>(null);

  useEffect(() => {
    if (!users || users.length === 0) getAllUsers();
    if (!evidences || evidences.length === 0) getAllEvidences();
  }, []);

  const user = useMemo(
    () => users?.find((u) => u._id === userId),
    [users, userId]
  );

  const userEvidences = useMemo(() => {
    if (!user) return [];
    let filtered =
      evidences?.filter((ev) =>
        ev.responsables.some((r) => r._id === user._id)
      ) || [];
    if (selectedEstado) {
      filtered = filtered.filter((ev) => ev.estado === selectedEstado);
    }
    return filtered;
  }, [evidences, user, selectedEstado]);

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

        {/* Filtro de estado */}
        <div className="flex items-center gap-4">
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
      </section>
    </DefaultLayout>
  );
}

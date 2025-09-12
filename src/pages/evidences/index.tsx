import DefaultLayout from "@/layouts/default";
import useHome from "./hooks/useHome";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EvidenceModal from "./components/Modal";
import { EvidenceCard } from "@/shared/components/EvidenceCard";

export default function IndexPage() {
  const { evidences, isLoading, error, clearError, components, users, currentFilter, setComponenteFilter, setUsuarioFilter } = useHome();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<any | null>(null);
  const componentItems = components?.map((c: any) => (
    <DropdownItem key={c._id} onClick={() => setComponenteFilter(c._id)}>
      {c.nombreComponente}
    </DropdownItem>
  ));

  const userItems = users?.map((u: any) => (
    <DropdownItem key={u._id} onClick={() => setUsuarioFilter(u._id)}>
      {u.nombre}
    </DropdownItem>
  ));
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 py-8 md:py-10 w-full">
        <div className="w-full max-w-6xl px-4">
          <header className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-semibold">Evidencias</h1>

            <div className="flex items-center gap-3">
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <span>{error}</span>
                  <button
                    onClick={() => clearError()}
                    className="text-gray-500 hover:text-gray-700"
                    title="Limpiar error"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Component filter dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button variant="bordered" color="warning">
                    {components?.length ? (components.find((c:any)=>c._id===currentFilter?.componente)?.nombreComponente ?? "Filtrar por componente") : "Filtrar por componente"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Filtrar por componente">
                  <DropdownItem onClick={() => setComponenteFilter(null)} key="all">Todos</DropdownItem>
                  {componentItems as any}
                </DropdownMenu>
              </Dropdown>

              {/* User filter dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button variant="bordered" color="warning">
                    {users?.length ? (users.find((u:any)=>u._id===currentFilter?.usuario)?.nombre ?? "Filtrar por usuario") : "Filtrar por usuario"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Filtrar por usuario">
                  <DropdownItem onClick={() => setUsuarioFilter(null)} key="all-users">Todos</DropdownItem>
                  {userItems as any}
                </DropdownMenu>
              </Dropdown>

              <Button
                color="success"
                onClick={() => navigate("/evidences/upload")}
                isLoading={false}
                className="px-4 py-2"
                variant="light"
              >
                Subir evidencia
              </Button>
            </div>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {evidences.length === 0 && !isLoading ? (
              <div className="col-span-full text-center text-gray-500 py-8 border rounded-lg bg-white/60">
                No hay evidencias disponibles.
              </div>
            ) : null}

            {evidences.map((ev: any) => {
              const key = ev._id;

              return (
                <EvidenceCard key={key} evidence={ev} />
              );
            })}
          </div>
        </div>

        <EvidenceModal
          evidence={selected}
          open={!!selected}
          onClose={() => setSelected(null)}
        />
      </section>
    </DefaultLayout>
  );
}

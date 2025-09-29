import DefaultLayout from "@/layouts/default";
import useHome from "./hooks/useHome";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EvidenceModal from "./components/Modal";
import { EvidenceCard } from "@/shared/components/EvidenceCard";

export default function IndexPage() {
  const {
    evidences,
    isLoading,
    error,
    clearError,
    components,
    users,
    currentFilter,
    setComponenteFilter,
    setUsuarioFilter,
    // Pagination helpers exposed by useHome
    page = 1,
    limit = 10,
    totalPages = 0,
    totalItems = 0,
    setPage,
    setLimit,
    isFiltering,
  } = useHome();

  const navigate = useNavigate();
  const [selected, setSelected] = useState<any | null>(null);

  // build dropdown items
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

  // Pagination controls use setPage / setLimit (which modify URL and trigger refresh via hook)
  const onPrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const onNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const onChangeLimit = (newLimit: number) => {
    setLimit(newLimit);
  };

  // display counts adapt when filtering (no paginado)
  const displayedTotal = isFiltering ? evidences.length : totalItems;
  const startItem = isFiltering ? (displayedTotal === 0 ? 0 : 1) : (displayedTotal === 0 ? 0 : (page - 1) * limit + 1);
  const endItem = isFiltering ? displayedTotal : Math.min(page * limit, displayedTotal);

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
              return <EvidenceCard key={key} evidence={ev} />;
            })}
          </div>

          {/* Pagination footer: hidden when filters active */}
          {!isFiltering && (
            <div className="w-full mt-6 flex items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Mostrando {startItem} - {endItem} de {displayedTotal}
              </div>

              <div className="flex items-center gap-2">
                <div className="text-sm mr-2">Por página:</div>
                <select
                  value={limit}
                  onChange={(e) => onChangeLimit(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                >
                  {[5, 10, 25, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

                <div className="flex items-center gap-2">
                  <Button variant="bordered" color="primary" onClick={onPrev} disabled={page <= 1 || isLoading}>
                    Anterior
                  </Button>
                  <div className="px-3 text-sm">
                    Página {page} de {totalPages || 1}
                  </div>
                  <Button variant="bordered" color="success" onClick={onNext} disabled={page >= (totalPages || 1) || isLoading}>
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          )}
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

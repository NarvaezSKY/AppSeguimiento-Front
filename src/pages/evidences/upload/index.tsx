import { useUpload } from "./hooks/useUpload";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import DefaultLayout from "@/layouts/default";

// combined form data is inferred

export default function UploadForm() {
  const {
    register,
    handleSubmit,
    reset,
    componentOptions,
    users,
    selectedComponentId,
    setSelectedComponentId,
    selectedResponsables,
    toggleResponsable,
    isUploadingActivity,
    isUploadingEvidence,
    error,
    taskUploaded,
    onSubmit,
    TIPOS_EVIDENCIA,
    MESES,
    ESTADOS,
    selectedTipo,
    setTipo,
    selectedMes,
    setMes,
    selectedEstado,
    setEstado,
  } = useUpload();

  // visual-only component; logic handled by useUpload hook

  return (
    <DefaultLayout>
      <section className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            Subir Actividad y Evidencia
          </h2>

          {/* Selección de componente (reemplaza input anterior) */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-2">
              Componente
            </label>

            <Dropdown placement="bottom-start">
              <DropdownTrigger>
                <button
                  type="button"
                  className="w-full text-left px-3 py-2 border rounded flex justify-between items-center"
                >
                  <span>
                    {selectedComponentId
                      ? componentOptions.find(
                          (o) => o.id === selectedComponentId
                        )?.label
                      : "Selecciona un componente"}
                  </span>
                  <span className="text-sm opacity-70">▾</span>
                </button>
              </DropdownTrigger>

              <DropdownMenu>
                {componentOptions.length === 0 ? (
                  <DropdownItem
                    isDisabled
                    key={"sin-componentes"}
                    textValue={"Sin componentes"}
                  >
                    Sin componentes
                  </DropdownItem>
                ) : (
                  componentOptions.map((opt) => (
                    <DropdownItem
                      key={opt.id}
                      onClick={() => setSelectedComponentId(opt.id)}
                      textValue={opt.label}
                    >
                      {opt.label}
                    </DropdownItem>
                  ))
                )}
              </DropdownMenu>
            </Dropdown>
          </div>

          {/* Combined form for activity + evidence */}
          <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              label="Actividad"
              placeholder="Nombre de la actividad"
              required
              disabled={isUploadingActivity || isUploadingEvidence}
              {...register("actividad", { required: true })}
            />
            <Input
              label="Meta Anual"
              type="number"
              placeholder="Meta anual"
              required
              disabled={isUploadingActivity || isUploadingEvidence}
              {...register("metaAnual", { required: true })}
            />

            {/* Tipo de evidencia (dropdown) */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Tipo de Evidencia
              </label>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 border rounded flex justify-between items-center"
                    disabled={isUploadingActivity || isUploadingEvidence}
                  >
                    <span>
                      {selectedTipo
                        ? TIPOS_EVIDENCIA.find((t) => t.value === selectedTipo)
                            ?.label
                        : "Selecciona tipo de evidencia"}
                    </span>
                    <span className="text-sm opacity-70">▾</span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu>
                  {TIPOS_EVIDENCIA.map((t) => (
                    <DropdownItem
                      key={t.value}
                      onClick={() => setTipo(t.value)}
                      textValue={t.label}
                    >
                      {t.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            {/* Mes (dropdown) */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Mes</label>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 border rounded flex justify-between items-center"
                    disabled={isUploadingActivity || isUploadingEvidence}
                  >
                    <span>
                      {selectedMes
                        ? MESES.find((m) => m.value === selectedMes)?.label
                        : "Selecciona mes"}
                    </span>
                    <span className="text-sm opacity-70">▾</span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu>
                  {MESES.map((m) => (
                    <DropdownItem
                      key={m.value}
                      onClick={() => setMes(m.value)}
                      textValue={m.label}
                    >
                      {m.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
            <Input
              label="Año"
              type="number"
              placeholder="Año"
              required
              disabled={isUploadingActivity || isUploadingEvidence}
              {...register("anio", { required: true })}
            />
            <Input
              label="Fecha de Entrega"
              type="date"
              required
              disabled={isUploadingActivity || isUploadingEvidence}
              {...register("fechaEntrega", { required: true })}
            />
            {/* Responsables: multi-select dropdown populated from users store */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Responsables
              </label>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 border rounded flex justify-between items-center"
                    disabled={isUploadingActivity || isUploadingEvidence}
                  >
                    <span>
                      {selectedResponsables.length > 0
                        ? selectedResponsables
                            .map((id) => {
                              const u = (users ?? []).find(
                                (x: any) => x._id === id || x.id === id
                              );
                              return u ? u.nombre || u.email : id;
                            })
                            .join(", ")
                        : "Selecciona responsables"}
                    </span>
                    <span className="text-sm opacity-70">▾</span>
                  </button>
                </DropdownTrigger>

                <DropdownMenu>
                  {(users ?? []).length === 0 ? (
                    <DropdownItem
                      isDisabled
                      key={"sin-usuarios"}
                      textValue={"Sin usuarios"}
                    >
                      Sin usuarios
                    </DropdownItem>
                  ) : (
                    (users ?? []).map((u: any) => {
                      const uid = u._id || u.id;
                      const label = u.nombre || u.email || uid;
                      const selected = selectedResponsables.includes(uid);
                      return (
                        <DropdownItem
                          key={uid}
                          onClick={() => toggleResponsable(uid)}
                          textValue={label}
                        >
                          <div className="flex justify-between items-center w-full">
                            <span>{label}</span>
                            {selected && (
                              <span className="text-sm text-green-600">✓</span>
                            )}
                          </div>
                        </DropdownItem>
                      );
                    })
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            {/* Estado (dropdown) */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Estado</label>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 border rounded flex justify-between items-center"
                    disabled={isUploadingActivity || isUploadingEvidence}
                  >
                    <span>
                      {selectedEstado
                        ? ESTADOS.find((e) => e.value === selectedEstado)?.label
                        : "Selecciona estado"}
                    </span>
                    <span className="text-sm opacity-70">▾</span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu>
                  {ESTADOS.map((e) => (
                    <DropdownItem
                      key={e.value}
                      onClick={() => setEstado(e.value)}
                      textValue={e.label}
                    >
                      {e.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            {error && <span className="text-red-500 text-sm">{error}</span>}

            <div className="flex items-center gap-3 mt-2">
              <Button
                color="default"
                type="button"
                onClick={() => reset()}
                disabled={isUploadingActivity || isUploadingEvidence}
              >
                Limpiar
              </Button>

              <div className="flex flex-col sm:flex-row items-end gap-2 w-full">
                <Button
                  color="primary"
                  type="submit"
                  isLoading={isUploadingActivity || isUploadingEvidence}
                  className="flex-1"
                >
                  Subir Tarea
                </Button>

                <div className="text-sm text-gray-700">
                  {isUploadingActivity && <span>Subiendo actividad...</span>}
                  {isUploadingEvidence && <span>Subiendo evidencia...</span>}
                  {!isUploadingActivity &&
                    !isUploadingEvidence &&
                    taskUploaded && (
                      <span className="text-green-600">
                        Tarea subida correctamente
                      </span>
                    )}
                </div>
              </div>
            </div>
          </form>
        </Card>
      </section>
    </DefaultLayout>
  );
}

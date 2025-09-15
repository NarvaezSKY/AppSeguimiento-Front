import { useUpload } from "./hooks/useUpload";
// import { Controller } from "react-hook-form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import DefaultLayout from "@/layouts/default";
import { concurrenciaEvidencia } from "./options/meses";
import DropdownField from "./components/DropDownReutilizable"; // <-- nuevo componente
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";

export default function UploadForm() {
  const {
    register,
    // control,
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
    selectedConcurrencia,
    setConcurrencia,
    selectedTrimestre,
    setTrimestre,
    selectedEstado,
    setEstado,
    trimestres,
    // new
    evidenceEntries,
    setEntryMes,
    setEntryTrimestre,
  } = useUpload();

  return (
    <DefaultLayout>
      <section className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">
            Subir Actividad y Evidencia
          </h2>

          {/* Selección de componente (reemplazado por DropdownField) */}
          <div className="mb-4">
            <DropdownField
              label="Componente"
              placeholder="Selecciona un componente"
              options={componentOptions.map((c: any) => ({
                value: c.id,
                label: c.label,
              }))}
              value={selectedComponentId ?? undefined}
              onChange={(v) => setSelectedComponentId(v as string)}
              disabled={isUploadingActivity || isUploadingEvidence}
            />
          </div>

          {/* Combined form for activity + evidence */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Actividad"
              placeholder="Nombre de la actividad"
              required
              disabled={isUploadingActivity || isUploadingEvidence}
              {...register("actividad", { required: true })}
            />

            {/* Concurrencia */}
            <DropdownField
              label="Concurrencia de Evidencia"
              placeholder="Selecciona concurrencia"
              options={concurrenciaEvidencia}
              value={selectedConcurrencia ?? undefined}
              onChange={(v) => setConcurrencia(v as number)}
              disabled={isUploadingActivity || isUploadingEvidence}
            />

            {/* Trimestre (general) */}
            <DropdownField
              label="Trimestre"
              placeholder="Selecciona trimestre"
              options={trimestres}
              value={selectedTrimestre ?? undefined}
              onChange={(v) => setTrimestre(v as number)}
              disabled={isUploadingActivity || isUploadingEvidence}
            />

            {/* Tipo de evidencia */}
            <DropdownField
              label="Tipo de Evidencia"
              placeholder="Selecciona tipo de evidencia"
              options={TIPOS_EVIDENCIA}
              value={selectedTipo ?? undefined}
              onChange={(v) => setTipo(v as string)}
              disabled={isUploadingActivity || isUploadingEvidence}
            />

            <Input
              label="Año"
              type="number"
              placeholder="Año"
              defaultValue="2025"
              required
              disabled={isUploadingActivity || isUploadingEvidence}
              {...register("anio", { required: true })}
            />

            {/* Dynamic entries for each evidence (mes, trimestre, fechaEntrega calculada) */}
            <div>
              <label className="block text-sm text-default-500 mb-2">Evidencias</label>
              <div className="flex flex-col gap-2">
                { (evidenceEntries ?? []).map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <DropdownField
                        label={`Mes #${idx + 1}`}
                        placeholder="Selecciona mes"
                        options={MESES}
                        value={entry.mes ?? undefined}
                        onChange={(v) => setEntryMes(idx, v as number)}
                        disabled={isUploadingActivity || isUploadingEvidence}
                      />
                    </div>

                    <div>
                      <DropdownField
                        label={`Trimestre #${idx + 1}`}
                        placeholder="Selecciona trimestre"
                        options={trimestres}
                        value={entry.trimestre ?? undefined}
                        onChange={(v) => setEntryTrimestre(idx, v as number)}
                        disabled={isUploadingActivity || isUploadingEvidence}
                      />
                    </div>

                    <div>
                      <Input
                        label={`Fecha de Entrega #${idx + 1}`}
                        type="date"
                        value={entry.fechaEntrega ?? ""}
                        disabled
                      />
                    </div>
                  </div>
                )) }
              </div>
            </div>

            {/* Responsables: mantengo la lógica previa (multi-select con checks) */}
            <div>
              <label className="block text-sm text-default-500 mb-2">
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

            {/* Estado (general) */}
            <DropdownField
              label="Estado"
              placeholder="Selecciona estado"
              options={ESTADOS}
              value={selectedEstado ?? undefined}
              onChange={(v) => setEstado(v as string)}
              disabled={isUploadingActivity || isUploadingEvidence}
            />

            {/* show error */}
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

                <div className="text-sm text-default-500">
                  {isUploadingActivity && <span>Subiendo actividad...</span>}
                  {isUploadingEvidence && <span>Subiendo evidencia...</span>}
                  {!isUploadingActivity &&
                    !isUploadingEvidence &&
                    taskUploaded && (
                      <span className="text-success-600">
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

import { useForm } from "react-hook-form";
import { useTasksStore } from "../../../store/tasks.store";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card } from "@heroui/card";
import { IUploadComponentReq } from "@/core/tasks/domain/upload-component/upload-component.req";
import { IUploadEvidenceReq } from "@/core/tasks/domain/upload-evidence/upload-evidence.req";
import DefaultLayout from "@/layouts/default";
import { useState } from "react";

export default function UploadForm() {
  // Formulario para componente
  const {
    register: registerComponent,
    handleSubmit: handleSubmitComponent,
    reset: resetComponent,
  } = useForm<IUploadComponentReq>();

  // Formulario para evidencia
  const {
    register: registerEvidence,
    handleSubmit: handleSubmitEvidence,
    reset: resetEvidence,
  } = useForm<IUploadEvidenceReq>();

  const { createComponent: uploadComponent, isLoading, error } = useTasksStore();
  const [componentSuccess, setComponentSuccess] = useState(false);

  const onSubmitComponent = async (data: IUploadComponentReq) => {
    try {
      await uploadComponent(data);
      setComponentSuccess(true);
      resetComponent();
    } catch (e) {
      setComponentSuccess(false);
    }
  };

  const uploadEvidence = async (data: IUploadEvidenceReq) => {
    // Aquí va tu lógica real de subida de evidencia
    alert("Evidencia subida correctamente");
    resetEvidence();
  };

  return (
    <DefaultLayout>
      <section className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-lg p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Subir Componente y Evidencia</h2>
          <form className="flex flex-col gap-4" onSubmit={handleSubmitComponent(onSubmitComponent)}>
            <Input
              label="Componente"
              placeholder="Nombre del componente"
              required
              {...registerComponent("componente", { required: true })}
            />
            <Input
              label="Actividad"
              placeholder="Actividad"
              required
              {...registerComponent("actividad", { required: true })}
            />
            <Input
              label="Meta Anual"
              type="number"
              placeholder="Meta anual"
              required
              {...registerComponent("metaAnual", { required: true, valueAsNumber: true })}
            />
            {error && <span className="text-red-500 text-sm">{error}</span>}
            {componentSuccess && (
              <span className="text-green-500 text-sm">¡Componente subido!</span>
            )}
            <Button color="primary" type="submit" isLoading={isLoading}>
              Subir Componente
            </Button>
          </form>

          <form
            className="flex flex-col gap-4 mt-8"
            onSubmit={handleSubmitEvidence(uploadEvidence)}
          >
            <Input
              label="Tipo de Evidencia"
              placeholder="Tipo de evidencia"
              required
              disabled={!componentSuccess}
              {...registerEvidence("tipoEvidencia", { required: true })}
            />
            <Input
              label="Mes"
              type="number"
              placeholder="Mes"
              required
              disabled={!componentSuccess}
              {...registerEvidence("mes", { required: true, valueAsNumber: true })}
            />
            <Input
              label="Año"
              type="number"
              placeholder="Año"
              required
              disabled={!componentSuccess}
              {...registerEvidence("anio", { required: true, valueAsNumber: true })}
            />
            <Input
              label="Fecha de Entrega"
              type="date"
              required
              disabled={!componentSuccess}
              {...registerEvidence("fechaEntrega", { required: true })}
            />
            <Input
              label="Responsables"
              placeholder="Responsables (separados por coma)"
              required
              disabled={!componentSuccess}
              {...registerEvidence("responsables", { required: true })}
            />
            <Input
              label="Estado"
              placeholder="Estado"
              required
              disabled={!componentSuccess}
              {...registerEvidence("estado", { required: true })}
            />
            <Button color="primary" type="submit" disabled={!componentSuccess}>
              Subir Evidencia
            </Button>
          </form>
        </Card>
      </section>
    </DefaultLayout>
  );
}
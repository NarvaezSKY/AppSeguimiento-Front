/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import DefaultLayout from "@/layouts/default";
import useHome from "./hooks/useHome";
import {
  Button,
  Card,
  Link,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Divider,
} from "@heroui/react";
import { FaTasks } from "react-icons/fa";
import { IoIosFolderOpen } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import Modal from "@/shared/components/Modal";
import UploadComponentForm from "./components/UploadComponentForm";
import { useTasksStore } from "@/store/tasks.store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EvidenceCard } from "@/shared/components/EvidenceCard/EvidenceCard";

export default function IndexPage() {
  const {
    components,
    refresh,
    dueMonthLabel,
    dashboardEvidences,
    upcomingEvidences,
    overdueEvidences,
    overdueCount,
    isDashboardLoading,
    refreshEvidencesDashboard,
  } = useHome();
  const deleteComponent = useTasksStore((s) => (s as any).deleteComponent);
  const { setLastComponentId } = useTasksStore();
  const [openCreate, setOpenCreate] = useState(false);
  const navigate = useNavigate();

  const handleEdit = (component: any) => {
    navigate(`/components/${component._id}/edit`);
  };

  const handleDelete = async (component: any) => {
    if (!confirm(`Eliminar componente "${component.nombreComponente}"?`))
      return;
    if (typeof deleteComponent === "function") {
      try {
        await deleteComponent(component._id);
        toast.success("Componente eliminado");
        try {
          await refresh();
        } catch {}
      } catch {
        toast.error("Error al eliminar componente");
      }
    } else {
      toast.error("Función de eliminar no implementada en el store");
    }
  };


  const colorTokens = [
    "success",
    "primary",
    "warning",
    "danger",
    "secondary",
    "default",
    "info",
  ];

  // Mapeo directo de colores para evitar problemas con clases dinámicas
  const colorMap = {
    success: "text-success bg-success/20",
    primary: "text-primary bg-primary/20",
    warning: "text-warning bg-warning/20",
    danger: "text-danger bg-danger/20",
    secondary: "text-secondary bg-secondary/20",
    default: "text-default bg-default/20",
    info: "text-info bg-info/20",
  };

  const getColorByIndex = (index: number) => {
    return colorTokens[index % colorTokens.length];
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 py-8 md:py-10 w-full bg-default-100 rounded">
        <Card className="w-full max-w-5xl mx-auto p-5 shadow-medium border border-default-200">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-warning-800">
                  Compromisos próximos a vencer
                </h3>
                <p className="text-sm text-warning-700/90">
                  Evidencias en estado 'Por entregar' acumuladas de {dueMonthLabel}
                </p>
              </div>
              <Button
                size="sm"
                variant="flat"
                color="warning"
                onClick={refreshEvidencesDashboard}
                isLoading={isDashboardLoading}
              >
                Actualizar
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="p-3 bg-white/80 shadow-none border border-default-200">
                <p className="text-xs uppercase text-default-500">
                  Por entregar este mes
                </p>
                <p className="text-2xl font-bold">
                  {dashboardEvidences.length}
                </p>
              </Card>
              <Card className="p-3 bg-white/80 shadow-none border border-default-200">
                <p className="text-xs uppercase text-default-500">
                  Proximas a vencer
                </p>
                <p className="text-2xl font-bold text-warning">
                  {upcomingEvidences.length}
                </p>
              </Card>
              <Card className="p-3 bg-white/80 shadow-none border border-default-200">
                <p className="text-xs uppercase text-default-500">Vencidas</p>
                <p className="text-2xl font-bold text-danger">{overdueCount}</p>
              </Card>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-default-700">
                Proximas a vencer
              </p>

              {!isDashboardLoading && upcomingEvidences.length === 0 && (
                <p className="text-sm text-default-500">
                  No hay evidencias proximas a vencer.
                </p>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {upcomingEvidences.map((evidence) => (
                  <EvidenceCard key={evidence._id} evidence={evidence} />
                ))}
              </div>
            </div>
            <Divider/>

            <div className="flex flex-col gap-2">
              <p className="text-xl font-medium text-default-700">Vencidas</p>

              {!isDashboardLoading && overdueEvidences.length === 0 && (
                <p className="text-sm text-default-500">
                  No hay evidencias vencidas.
                </p>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {overdueEvidences.map((evidence) => (
                  <EvidenceCard key={evidence._id} evidence={evidence} />
                ))}
              </div>
            </div>
          </div>
        </Card>
        <Divider className="max-w-5xl"/>

        <div className="flex justify-between w-full max-w-5xl mb-2 px-4 gap-2">
          <h1 className="text-4xl font-semibold">Componentes</h1>
          <Button
            color="primary"
            isLoading={false}
            className="px-4 py-2 text-white"
            variant="solid"
            onClick={() => setOpenCreate(true)}
          >
            Agregar componente
          </Button>
        </div>

        {components.map((c: any, index) => {
          // Opción 1: Usar índice del array (garantiza colores únicos secuenciales)
          const colorToken = getColorByIndex(index);

          const colorClasses = colorMap[colorToken as keyof typeof colorMap];

          return (
            <Link
              href={`/${c._id}/responsables`}
              isExternal={false}
              key={c._id}
              className="w-full"
              onClick={() => setLastComponentId(c._id)}
            >
              <Card
                key={c._id}
                className="w-full max-w-5xl mx-auto shadow-medium hover:shadow-large transition-shadow duration-200 cursor-pointer"
              >
                <div className="p-6 flex items-center">
                  <div className="flex items-center gap-1 mr-4">
                    <div className="ml-0">
                      <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                          <button
                            className="p-2 rounded hover:bg-default-100 transition-colors"
                            aria-label="Más opciones"
                          >
                            <FiMoreVertical size={18} />
                          </button>
                        </DropdownTrigger>

                        <DropdownMenu aria-label="Opciones componente">
                          <DropdownItem onClick={() => handleEdit(c)} key={"1"}>
                            Editar
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => handleDelete(c)}
                            className="text-danger"
                            key={"2"}
                          >
                            Eliminar
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <span
                      aria-hidden
                      title={`${colorToken} - Index: ${index}`}
                      className={`flex items-center justify-center rounded-md w-10 h-10 ${colorClasses}`}
                    >
                      <IoIosFolderOpen size={24} />
                    </span>
                  </div>
                  <h2 className="text-2xl font-semibold mb-0 w-full truncate">
                    {c.nombreComponente}
                  </h2>
                </div>
              </Card>
            </Link>
          );
        })}

        <Link href="/evidences" isExternal={false}>
          <Button color="success" variant="light" className="px-4 py-2">
            <FaTasks className="mr-2" />
            Ver todos los compromisos
          </Button>
        </Link>

        <Modal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          title="Crear componente"
          size="sm"
        >
          <UploadComponentForm onClose={() => setOpenCreate(false)} />
        </Modal>
      </section>
    </DefaultLayout>
  );
}

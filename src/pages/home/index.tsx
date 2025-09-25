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
} from "@heroui/react";
import { FaTasks } from "react-icons/fa";
import { IoIosFolderOpen } from "react-icons/io";
import { FiMoreVertical } from "react-icons/fi";
import Modal from "@/shared/components/Modal";
import UploadComponentForm from "./components/UploadComponentForm";
import { useTasksStore } from "@/store/tasks.store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function IndexPage() {
  const { components, refresh } = useHome();
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
        } catch { }
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

  // Función hash mejorada para mejor distribución
  const stringToIndex = (s: string | undefined, len: number) => {
    if (!s) return 0;
    let hash = 0;
    // Usamos una combinación de algoritmos para mejor distribución
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    // Agregamos más entropia usando la longitud del string
    hash = hash + s.length * 31;
    return Math.abs(hash) % len;
  };

  // Alternativa: usar el índice del array directamente para garantizar colores únicos
  const getColorByIndex = (index: number) => {
    return colorTokens[index % colorTokens.length];
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 py-8 md:py-10 w-full bg-default-100 rounded">
        <div className="flex justify-between w-full max-w-2xl mb-7 px-4 gap-2">
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
          
          // Opción 2: Usar hash mejorado (mantiene consistencia basada en ID)
          // const idx = stringToIndex(c._id ?? c.nombreComponente, colorTokens.length);
          // const colorToken = colorTokens[idx];
          
          const colorClasses = colorMap[colorToken as keyof typeof colorMap];

          // Debug: mostrar en consola qué color se asigna
          console.log(`Componente ${index}: ${c.nombreComponente}, Color: ${colorToken}`);

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
                className="w-full max-w-2xl mx-auto shadow-medium hover:shadow-large transition-shadow duration-200 cursor-pointer"
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
                  <h2 className="text-2xl font-semibold mb-0 max-w-xl truncate">
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
            Ver todas las evidencias
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

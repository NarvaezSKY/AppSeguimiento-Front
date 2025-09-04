import DefaultLayout from "@/layouts/default";
import useHome from "./hooks/useHome";
import { Button, Card, Link } from "@heroui/react";
import { FaTasks } from "react-icons/fa";
import { IoIosFolderOpen } from "react-icons/io";
export default function IndexPage() {
  const { components } = useHome();
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 py-8 md:py-10 w-full">
        <div className="flex justify-around w-full max-w-3xl mb-7 px-4 gap-2">
          <h1 className="text-4xl font-semibold">Componentes</h1>
          <Button
            color="success"
            isLoading={false}
            className="px-4 py-2"
          >
            Agregar componente
          </Button>
          <Link href="/evidences" isExternal={false}>
            <Button color="success" variant="light" className="px-4 py-2">
              <FaTasks className="mr-2" />
              Ver todas las evidencias
            </Button>
          </Link>
        </div>
        {components.map((c) => (
          <Card
            key={c._id}
            className="w-full max-w-2xl mx-auto shadow-medium hover:shadow-large transition-shadow duration-200"
          >
            <div className="p-6 flex items-center justify-center gap-4">
              <IoIosFolderOpen className="text-gray-400" size={34} />
              <h2 className="text-2xl font-semibold mb-2">{c.componente}</h2>
            </div>
          </Card>
        ))}
      </section>
    </DefaultLayout>
  );
}

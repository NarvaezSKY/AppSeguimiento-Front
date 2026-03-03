import DefaultLayout from "@/layouts/default";
import { Button, Divider } from "@heroui/react";
import { PBI_URL } from "@/config/config";
export const PowerBIReport = () => {
  return (
    <DefaultLayout>
      <div className="flex w-full items-center justify-center flex-col gap-2 my-4">
        <Button
          as="a"
          href={PBI_URL}
          target="_blank"
          rel="noopener noreferrer"
          color="success"
          variant="flat"
          fullWidth
          radius="sm"
          className="text-success font-semibold"
        >
          Ver en Power BI
        </Button>
        <Divider className="my-2" />
        <iframe
          title="Reporte Seguimiento Plan Operativo"
          className="border-2 border-success rounded-lg"
          width="100%"
          height="900"
          src={PBI_URL}
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
      <Divider className="my-4" />
    </DefaultLayout>
  );
};

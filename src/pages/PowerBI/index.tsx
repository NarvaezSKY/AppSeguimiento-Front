import DefaultLayout from "@/layouts/default";
import { Divider, Link } from "@heroui/react";

export const PowerBIReport = () => {
  return (
    <DefaultLayout>
      <div className="flex w-full items-center justify-center flex-col gap-2">
        <iframe
          title="Reporte Seguimiento Plan Operativo"
          width="100%"
          height="700"
          src="https://app.powerbi.com/view?r=eyJrIjoiNDI3MzY4OWQtMmZmOS00ODc0LWI3ZjctZjA2NWE3YmYwMjZkIiwidCI6ImNiYzJjMzgxLTJmMmUtNGQ5My05MWQxLTUwNmM5MzE2YWNlNyIsImMiOjR9"
          frameBorder="0"
          allowFullScreen={true}
        ></iframe>
      </div>
      <Divider className="my-4" />
      <Link
        isExternal
        color="success"
        className="font-semibold"
        href="https://app.powerbi.com/view?r=eyJrIjoiNDI3MzY4OWQtMmZmOS00ODc0LWI3ZjctZjA2NWE3YmYwMjZkIiwidCI6ImNiYzJjMzgxLTJmMmUtNGQ5My05MWQxLTUwNmM5MzE2YWNlNyIsImMiOjR9"
      >
        Ver en Power BI
      </Link>
    </DefaultLayout>
  );
};

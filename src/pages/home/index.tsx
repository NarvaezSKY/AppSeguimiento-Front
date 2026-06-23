/* eslint-disable react/no-unescaped-entities */
import { useCallback, useEffect, useState } from "react";
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
import type { IEvidence } from "@/core/tasks/domain/upload-evidence/upload-evidence.res";
import logoSrc from "@/assets/logo-coord-mis-reg.png";
import logoSenaSrc from "@/assets/logo-sena.png";
import { useAuthStore } from "@/store/auth.store";

const UPCOMING_PAGE_SIZE = 10;

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
  const [upcomingPage, setUpcomingPage] = useState(1);
  const navigate = useNavigate();

  const totalUpcomingPages = Math.max(
    1,
    Math.ceil(upcomingEvidences.length / UPCOMING_PAGE_SIZE),
  );
  const paginatedUpcoming = upcomingEvidences.slice(
    (upcomingPage - 1) * UPCOMING_PAGE_SIZE,
    upcomingPage * UPCOMING_PAGE_SIZE,
  );

  useEffect(() => {
    setUpcomingPage(1);
  }, [upcomingEvidences.length]);

  const buildEmailBody = useCallback(() => {
    const grouped: Record<string, IEvidence[]> = {};
    for (const ev of upcomingEvidences) {
      const names = ev.responsables.map((r) => r.nombre);
      if (names.length === 0) {
        (grouped["Sin responsable"] ??= []).push(ev);
      } else {
        for (const name of names) {
          (grouped[name] ??= []).push(ev);
        }
      }
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDate = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
    };

    const monthNames = [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
    ];

    const lines: string[] = [];
    for (const [nombre, evidences] of Object.entries(grouped)) {
      lines.push(`Compromisos pendientes para ${nombre}:`);
      for (const ev of evidences) {
        const dueDate = new Date(ev.fechaEntrega);
        dueDate.setHours(0, 0, 0, 0);
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );
        const mesLabel = `${monthNames[ev.mes - 1] ?? ev.mes}`;
        lines.push(
          `${ev.actividad.componente.nombreComponente} - ${ev.actividad.actividad} - ${ev.tipoEvidencia} - ${mesLabel} - Vence el ${formatDate(ev.fechaEntrega)} (en ${daysUntilDue} día(s))`,
        );
      }
      lines.push("");
    }
    return lines.join("\n");
  }, [upcomingEvidences]);

  const handleCopyInfo = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(buildEmailBody());
      toast.success("Información copiada al portapapeles");
    } catch {
      toast.error("No se pudo copiar la información");
    }
  }, [buildEmailBody]);

  const getLogoBase64 = useCallback(async (url: string): Promise<string> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch {
      return "";
    }
  }, []);

  const buildEmailHTML = useCallback(
    (coordLogo: string, senaLogo: string) => {
      const grouped: Record<string, IEvidence[]> = {};
      for (const ev of upcomingEvidences) {
        const names = ev.responsables.map((r) => r.nombre);
        if (names.length === 0) {
          (grouped["Sin responsable"] ??= []).push(ev);
        } else {
          for (const name of names) {
            (grouped[name] ??= []).push(ev);
          }
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
      };

      const monthNames = [
        "Enero","Febrero","Marzo","Abril","Mayo","Junio",
        "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
      ];

      const currentMonth = monthNames[new Date().getMonth()];

      let rowsHTML = "";
      for (const [nombre, evidences] of Object.entries(grouped)) {
        rowsHTML += `<tr><td colspan="5" style="padding:14px 0 6px;font-weight:700;color:#7c3aed;font-size:14px;border-bottom:1px solid #e5e7eb;">Compromisos para ${nombre}</td></tr>`;
        for (const ev of evidences) {
          const dueDate = new Date(ev.fechaEntrega);
          dueDate.setHours(0, 0, 0, 0);
          const daysUntilDue = Math.ceil(
            (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
          );
          const mesLabel = monthNames[ev.mes - 1] ?? ev.mes;
          rowsHTML += `<tr style="background-color:#ffffff;">
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${ev.actividad.componente.nombreComponente}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${ev.actividad.actividad}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${ev.tipoEvidencia} - ${mesLabel}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;font-weight:700;color:#111827;">${formatDate(ev.fechaEntrega)}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;white-space:nowrap;font-weight:700;color:${daysUntilDue <= 3 ? "#dc2626" : "#d97706"};">${daysUntilDue} día(s)</td>
          </tr>`;
        }
      }

      const headerCellStyle = "padding:12px 14px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;color:#6b7280;background-color:#f9fafb;border-bottom:2px solid #e5e7eb;letter-spacing:0.5px;";

      const senaImg = senaLogo
        ? `<img src="${senaLogo}" alt="SENA" style="height:60px;width:auto;" />`
        : "";
      const coordImg = coordLogo
        ? `<img src="${coordLogo}" alt="CMR" style="height:60px;width:auto;" />`
        : "";

      return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:30px 12px;background-color:#f0f0f0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;">
  <table role="presentation" style="width:100%;max-width:700px;margin:0 auto;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06);">
    <tr>
      <td style="padding:24px 32px;background:linear-gradient(135deg,#7c3aed,#9333ea);">
        <table role="presentation" style="width:100%;">
          <tr>
            <td style="vertical-align:middle;">${coordImg}</td>
            <td style="vertical-align:middle;text-align:center;">
              <div style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:0.3px;">Plan Operativo CMR</div>
              <div style="font-size:13px;color:#c4b5fd;margin-top:2px;">Seguimiento ${currentMonth}</div>
            </td>
            <td style="vertical-align:middle;text-align:right;">${senaImg}</td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:32px 32px 24px;">
        <p style="margin:0 0 6px;font-size:18px;font-weight:700;color:#111827;">Recordatorio de compromisos</p>
        <p style="margin:0 0 4px;font-size:14px;color:#4b5563;line-height:1.6;">
          Cordial saludo.
        </p>
        <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.6;">
          A continuaci&oacute;n se relacionan los compromisos pendientes por entregar correspondientes al per&iacute;odo de ${currentMonth}. Agradecemos realizar la entrega de las evidencias en las fechas establecidas para dar cumplimiento al Plan Operativo CMR.
        </p>
        <table role="presentation" style="width:100%;border-collapse:collapse;border-radius:6px;overflow:hidden;border:1px solid #e5e7eb;">
          <thead>
            <tr>
              <th style="${headerCellStyle}">Componente</th>
              <th style="${headerCellStyle}">Actividad</th>
              <th style="${headerCellStyle}">Tipo - Mes</th>
              <th style="${headerCellStyle}">Vence</th>
              <th style="${headerCellStyle}">D&iacute;as</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background-color:#ffffff;border-top:1px solid #e5e7eb;">
        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center;line-height:1.5;">
          &copy; ${new Date().getFullYear()} Seguimiento CMR &mdash; Coordinaci&oacute;n de Misional y Regional<br>
          <span style="color:#c4b5fd;">Sistema de Seguimiento &mdash; Plan Operativo CMR</span>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
    },
    [upcomingEvidences],
  );

  const handleSendEmail = useCallback(async () => {
    const authUser = useAuthStore.getState().user;
    const loggedInEmail = authUser?.email ?? authUser?.admin?.email ?? "";

    const allEmails = [
      ...new Set(
        upcomingEvidences.flatMap((ev) =>
          ev.responsables.map((r) => r.email),
        ),
      ),
    ];
    const emails = loggedInEmail
      ? allEmails.filter((e) => e !== loggedInEmail)
      : allEmails;
    const to = emails.join(";");

    const monthNames = [
      "Enero","Febrero","Marzo","Abril","Mayo","Junio",
      "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
    ];
    const currentMonth = monthNames[new Date().getMonth()];
    const subject = encodeURIComponent(
      `Recordatorio de entrega de compromisos ${currentMonth} - Seguimiento al Plan Operativo CMR`,
    );

    try {
      const [coordB64, senaB64] = await Promise.all([
        getLogoBase64(logoSrc),
        getLogoBase64(logoSenaSrc),
      ]);
      const htmlContent = buildEmailHTML(coordB64, senaB64);
      const plainContent = buildEmailBody();

      const htmlBlob = new Blob([htmlContent], { type: "text/html" });
      const plainBlob = new Blob([plainContent], { type: "text/plain" });
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": plainBlob,
        }),
      ]);

      toast.success("HTML copiado al portapapeles. Pega (Ctrl+V) en el correo para ver el diseño.");
    } catch {
      toast.error("No se pudo copiar el HTML.");
    }

    const greeting = encodeURIComponent(
      `Cordial saludo.\n\nA continuación encontrará el detalle de los compromisos próximos a vencer correspondientes al período de ${currentMonth}.\n\n*Pegue (Ctrl+V) el contenido copiado al portapapeles para ver el diseño completo con logos, tabla y colores.*`,
    );
    window.location.href = `mailto:${to}?subject=${subject}&body=${greeting}`;
  }, [upcomingEvidences, buildEmailBody, buildEmailHTML, getLogoBase64]);

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
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={handleCopyInfo}
                  isDisabled={upcomingEvidences.length === 0}
                >
                  Copiar información
                </Button>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  onPress={handleSendEmail}
                  isDisabled={upcomingEvidences.length === 0}
                >
                  Enviar por correo
                </Button>
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
                {paginatedUpcoming.map((evidence) => (
                  <EvidenceCard key={evidence._id} evidence={evidence} />
                ))}
              </div>

              {totalUpcomingPages > 1 && (
                <div className="flex items-center justify-between gap-4 mt-2">
                  <div className="text-sm text-default-500">
                    Mostrando {(upcomingPage - 1) * UPCOMING_PAGE_SIZE + 1} -{" "}
                    {Math.min(
                      upcomingPage * UPCOMING_PAGE_SIZE,
                      upcomingEvidences.length,
                    )}{" "}
                    de {upcomingEvidences.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() =>
                        setUpcomingPage((p) => Math.max(1, p - 1))
                      }
                      isDisabled={upcomingPage <= 1}
                    >
                      Anterior
                    </Button>
                    <div className="px-3 text-sm">
                      Página {upcomingPage} de {totalUpcomingPages}
                    </div>
                    <Button
                      size="sm"
                      variant="bordered"
                      color="success"
                      onPress={() =>
                        setUpcomingPage((p) =>
                          Math.min(totalUpcomingPages, p + 1),
                        )
                      }
                      isDisabled={upcomingPage >= totalUpcomingPages}
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              )}
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

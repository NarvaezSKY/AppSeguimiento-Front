export const getStatusColor = (estado: string) => {
  if (!estado) return "default";
  const s = estado.trim().toLowerCase();
  switch (s) {
    case "entregada":
      return "success";
    case "entrega futura":
      return "default";
    case "por entregar":
      return "danger";
    case "entrega extemporanea":
      return "warning";
    case "no logro":
      return "secondary";
  }
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
};

export const getMonthName = (mes: number) => {
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return months[mes - 1] || "Mes inválido";
};

import { Option } from "./estados";

export const TIPOS_EVIDENCIA: Option<string>[] = [
	{ value: "formato", label: "Formato" },
	{ value: "actas", label: "ACTAS" },
	{ value: "correos_electronicos", label: "Correos electrónicos" },
	{ value: "informe", label: "Informe" },
	{ value: "matriz_informe", label: "Matriz/Informe" },
	{ value: "planes", label: "Planes" },
	{ value: "reporte", label: "Reporte" },
	{ value: "otro", label: "Otro" },
];

export type TipoEvidencia = typeof TIPOS_EVIDENCIA[number]["value"];

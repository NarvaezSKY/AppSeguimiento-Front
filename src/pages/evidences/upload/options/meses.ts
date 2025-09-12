import { Option } from "./estados";

export const MESES: Option<number>[] = [
	{ value: 1, label: "Enero" },
	{ value: 2, label: "Febrero" },
	{ value: 3, label: "Marzo" },
	{ value: 4, label: "Abril" },
	{ value: 5, label: "Mayo" },
	{ value: 6, label: "Junio" },
	{ value: 7, label: "Julio" },
	{ value: 8, label: "Agosto" },
	{ value: 9, label: "Septiembre" },
	{ value: 10, label: "Octubre" },
	{ value: 11, label: "Noviembre" },
	{ value: 12, label: "Diciembre" },
];

export type Mes = typeof MESES[number]["value"];

export const concurrenciaEvidencia: Option<number>[] = [
	{ value: 1, label: "Anual" },
	{ value: 11, label: "Mensual" },
	{ value: 2, label: "Semestral" },
	{ value: 4, label: "Trimestral" },
	{ value: 6, label: "Bimestral" },
]

export type ConstanciaEvidencia = typeof concurrenciaEvidencia[number]["value"];
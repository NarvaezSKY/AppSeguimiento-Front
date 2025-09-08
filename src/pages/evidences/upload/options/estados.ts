// Option type used by multiple select inputs in the upload form
export interface Option<T = string> {
	value: T;
	label: string;
	/** optional flag to mark the option disabled in the UI */
	disabled?: boolean;
}

// Common estados used across the app. Values match the backend expected strings.
export const ESTADOS: Option<string>[] = [
	{ value: "Entregada", label: "Entregada" },
	{ value: "Entrega futura", label: "Entrega futura" },
	{ value: "Por entregar", label: "Por entregar" },
	{ value: "Entrega Extemporanea", label: "Entrega Extemporanea" },
	{ value: "No logro", label: "No logro" },
];

export type Estado = typeof ESTADOS[number]["value"];

import pfpEdith from "@/assets/profiles/Edith.png";
import pfpJuian from "@/assets/profiles/Inge Julian.png";
import pfpRodrigo from "@/assets/profiles/Rodrigo.png";
import pfpDiego from "@/assets/profiles/Diego.png";
import pfpAndrea from "@/assets/profiles/Andrea.png";
import pfpClaudia from "@/assets/profiles/DoñaClau.png";
import pfpCarolina from "@/assets/profiles/Carolina.png";
import pfpVeronica from "@/assets/profiles/Veronica.png";
import pfpNini from "@/assets/profiles/Nini.jpg";
import pfpConcepcion from "@/assets/profiles/Concepcion.jpeg";

export interface ProfileImageData {
  src: string;
  alt: string;
}

const normalizeProfileName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const RAW_PROFILE_IMAGES: Record<string, ProfileImageData> = {
  "Edith Betancourt Sánchez": { src: pfpEdith, alt: "Edith Betancourt" },
  "Julián Andrés Garcés Muñoz": {
    src: pfpJuian,
    alt: "Julián Andrés Garcés",
  },
  "Rodrigo Alberto Montaño Fuentes": {
    src: pfpRodrigo,
    alt: "Rodrigo Alberto Montaño",
  },
  "Diego Arley Arias Guzman": {
    src: pfpDiego,
    alt: "Diego Arley Arias Guzman",
  },
  "Luz Andrea Granada Ceballos": {
    src: pfpAndrea,
    alt: "Luz Andrea Granada Ceballos",
  },
  "Claudia Patricia Giraldo Carmona": {
    src: pfpClaudia,
    alt: "Claudia Patricia Giraldo Carmona",
  },
  "Carolina Chaves Dueñas": {
    src: pfpCarolina,
    alt: "Carolina Chaves Dueñas",
  },
  "Veronica Natalia Arenas Garcia": {
    src: pfpVeronica,
    alt: "Veronica Natalia Arenas Garcia",
  },
  "Nini Johanna Sanchez Velasco": {
    src: pfpNini,
    alt: "Nini Johanna Sanchez Velasco",
  },
  "Concepción Hurtado Chantre": {
    src: pfpConcepcion,
    alt: "Concepción Hurtado Chantre",
  },
};

export const PROFILE_IMAGES: Record<string, ProfileImageData> = Object.entries(
  RAW_PROFILE_IMAGES
).reduce(
  (acc, [name, image]) => {
    acc[normalizeProfileName(name)] = image;
    return acc;
  },
  {} as Record<string, ProfileImageData>
);

export const getProfileImage = (name?: string | null): ProfileImageData | null => {
  if (!name) return null;
  return PROFILE_IMAGES[normalizeProfileName(name)] ?? null;
};

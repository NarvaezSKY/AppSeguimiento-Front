export interface IUploadEvidenceRes {
  success: true;
  // el endpoint a veces devuelve un único objeto o un arreglo — soportamos ambos
  data: IEvidence[];
}

export interface IEvidence {
  actividad: {
    _id: string;
    actividad: string;
    metaAnual: number;
    componente: {
      _id: string;
      nombreComponente: string;
      __v?: number;
    };
    __v?: number;
  };
  tipoEvidencia: string;
  mes: number;
  anio: number;
  responsables: {
    _id: string;
    nombre: string;
    email: string;
    vinculacion: string;
    createdAt: string;
    __v?: number;
  }[];
  estado: string;
  fechaEntrega: string;
  _id: string;
  creadoEn: string;
}
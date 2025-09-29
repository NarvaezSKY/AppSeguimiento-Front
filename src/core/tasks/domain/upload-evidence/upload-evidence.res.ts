export interface IUploadEvidenceRes {
  success: true;
  data: IEvidence[];
  total?: number;
  page?: number;
  totalPages?: number;
  perPage?: number;
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
  entregadoEn: string | null;
  tipoEvidencia: string;
  mes: number;
  trimestre: number;
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
export interface IGetAllEvidencesReq {
  actividad?: string;
  mes?: number | string;
  anio?: number | string;
  estado?: string;
  componente?: string;
  responsable?: string;
  trimestre?: number;
  justificacion?: string;
  page?: number;
  limit?: number;
}
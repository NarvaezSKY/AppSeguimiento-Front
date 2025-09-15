export interface IUploadEvidenceReq {
    componente: string,
    tipoEvidencia: string,
    trimestre: number,
    mes: number,
    anio: number,
    fechaEntrega: string,
    responsables: [string],
    estado: string
}

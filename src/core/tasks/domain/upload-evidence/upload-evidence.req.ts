export interface IUploadEvidenceReq {
    componente: string,
    tipoEvidencia: string,
    mes: number,
    anio: number,
    fechaEntrega: string,
    responsables: [string],
    estado: string
}

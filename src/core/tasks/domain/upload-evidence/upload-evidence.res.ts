export interface IUploadEvidenceRes {
    success: true,
    data: IEvidence[]
}

export interface IEvidence {
    componente: {
        _id: string,
        componente: string,
        actividad: string,
        metaAnual: number,
        __v: number
    },
    tipoEvidencia: string,
    mes: number,
    anio: number,
    responsables: [
        {
            _id: string,
            nombre: string,
            email: string,
            vinculacion: string,
            createdAt: string,
            __v: number
        }
    ],
    estado: string,
    fechaEntrega: string,
    _id: string,
    creadoEn: string
}
export interface IGetComponentsRes {
    success: boolean
    data: IComponents[]
}


export interface IComponents {
    _id: string,
    componente: string,
    actividad: string,
    metaAnual: number
}
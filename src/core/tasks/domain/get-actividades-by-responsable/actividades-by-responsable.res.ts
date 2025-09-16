import { IComponents } from "../get-components/get-components.res"

export interface IGetActividadesByResponsableRes {
    success: boolean
    data: IActivityRes[]
}

export interface IActivityRes {
    actividad: string
    metaAnual: number
    componente: IComponents[]
    _id: string
}
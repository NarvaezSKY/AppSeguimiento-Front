import { IComponents } from "../get-components/get-components.res"

export interface IGetActividadesByResponsableRes {
    success: boolean
    data: IActivitiesByYearRes
}

export type IActivitiesByYearRes = Record<string, IActivityRes[]>

export interface IActivityRes {
    actividad: string
    metaAnual: number
    componente: IComponents[]
    _id: string
}
export interface IGetComponentsRes {
    success: boolean
    data: IComponents[]
}


export interface IComponents {
    _id: string,
    nombreComponente: string,
}
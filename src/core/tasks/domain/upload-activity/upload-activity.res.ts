export interface IUploadActivityRes {
    success: boolean
    data: IActivity
}

export interface IActivity {
    actividad: string
    metaAnual: number
    componente: string[]
    _id: string
}
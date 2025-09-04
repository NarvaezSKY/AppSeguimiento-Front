export interface IUploadUserRes {
    success: boolean,
    data: {
        nombre: string,
        email: string,
        vinculacion: string,
        _id: string,
        createdAt: string
    }
}
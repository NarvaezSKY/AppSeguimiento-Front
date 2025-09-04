export interface IGetAllUsersRes {
    success: boolean,
    data: User[]
}

export interface User {
    _id: string,
    nombre: string,
    email: string,
    vinculacion: string
    createdAt: string
}
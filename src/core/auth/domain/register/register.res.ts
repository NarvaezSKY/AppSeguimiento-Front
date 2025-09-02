export interface IRegisterRes {
    success: boolean,
    data: {
        _id: string,
        email: string,
        name: string,
        createdAt: Date,
        __v: number
    }
}
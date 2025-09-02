export interface ILoginRes {
    success: true,
    data: {
        token: string
        admin: {
            id: string,
            name: string,
            email: string
        }
    }
}
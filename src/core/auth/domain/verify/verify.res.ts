export interface IVerifyRes {
    success: boolean;
    data: Data;
}

interface Data {
    id: string;
    email: string;
    name: string;
    iat: number;
    exp: number;
}
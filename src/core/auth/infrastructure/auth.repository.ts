import { BACKEND_URL } from '@/config/config';
import axiosInstance from '@/config/instance';
import { IAuthRepository } from '../domain/auth.repository';
import { ILoginReq } from '../domain/login';
import { IRegisterReq } from '../domain/register';

const login = async (data: ILoginReq) => {
    try {
        const response = await axiosInstance.post("/auth/login", data);
        console.log(BACKEND_URL)
        return response.data;
    } catch (error) {
        console.error("Error during login:", error);
        throw error;
    }
}

const adminRegister = async (data: IRegisterReq) => {
    try {
        const response = await axiosInstance.post("/auth/register", data);
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

const verify = async () => {
    try {
        const response = await axiosInstance.get("/auth/verify");
        return response.data;
    } catch (error) {
        console.error("Error during verification:", error);
        throw error;
    }
}

export const authRepository: IAuthRepository = {
    login,
    adminRegister,
    verify,
}
import axiosInstance from "@/config/instance";
import { IUsersRepository } from "../domain/users.repository";
import { IUploadUserReq } from "../domain/upload-user";

const uploadUser = async (data: IUploadUserReq) => {
    try {
        const response = await axiosInstance.post("/users", data);
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

const getAllUsers = async () => {
    try {
        const response = await axiosInstance.get("/users");
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

export const usersRepository: IUsersRepository = { uploadUser, getAllUsers };
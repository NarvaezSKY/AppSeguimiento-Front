import axiosInstance from "@/config/instance";
import { ITasksRepository } from "../domain/tasks.repository";
import { IUploadComponentReq } from "../domain/upload-component";
import { IUploadEvidenceReq } from "../domain/upload-evidence";

const uploadComponent = async (data: IUploadComponentReq) => {
    try {
        const response = await axiosInstance.post("/components", data);
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

const uploadEvidence = async (data: IUploadEvidenceReq) => {
    try {
        const response = await axiosInstance.post("/evidencias", data);
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

const getAllEvidences = async () => {
    try {
        const response = await axiosInstance.get("/evidencias");
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

const getUniqueComponents = async () => {
    try {
        const response = await axiosInstance.get("/componentes/unique-componentes");
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

export const tasksRepository: ITasksRepository = {
    uploadComponent,
    uploadEvidence,
    getAllEvidences,
    getUniqueComponents
};
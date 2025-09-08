import axiosInstance from "@/config/instance";
import { ITasksRepository } from "../domain/tasks.repository";
import { IUploadComponentReq } from "../domain/upload-component";
import { IUploadEvidenceReq } from "../domain/upload-evidence";
import { IGetAllEvidencesReq } from "../domain/get-evidences";
import { IUploadActivityReq } from "../domain/upload-activity";

const uploadComponent = async (data: IUploadComponentReq) => {
    try {
        const response = await axiosInstance.post("/componentes", data);
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

const getAllEvidences = async (filter?: IGetAllEvidencesReq) => {
    try {
        const params: any = {};
        if (!filter) {
            // no params
        } else {
            if (filter.actividad) params.actividad = filter.actividad;
            if (filter.mes != null) params.mes = Number(filter.mes);
            if (filter.anio != null) params.anio = Number(filter.anio);
            if (filter.estado) params.estado = filter.estado;
            if (filter.componente) params.componente = filter.componente;
        }
        const response = await axiosInstance.get("/evidencias", { params });
        return response.data;
    } catch (error) {
        console.error("Error during getAllEvidences:", error);
        throw error;
    }
}

const getUniqueComponents = async () => {
    try {
        const response = await axiosInstance.get("/componentes");
        return response.data;
    } catch (error) {
        console.error("Error during register:", error);
        throw error;
    }
}

const uploadActivity = async (data: IUploadActivityReq) => {
    try {
        const response = await axiosInstance.post("/actividades", data);
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
    getUniqueComponents,
    uploadActivity
};
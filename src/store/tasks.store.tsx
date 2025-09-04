import { create } from "zustand";

import { uploadComponentUseCase, uploadEvidenceUseCase, getAllEvidencesUseCase, getComponentsUseCase } from "@/core/tasks/application";
import { tasksRepository } from "@/core/tasks/infrastructure/tasks.repository";
import { IEvidence } from "@/core/tasks/domain/upload-evidence";
import { IComponents } from "@/core/tasks/domain/get-components/get-components.res";

interface TasksState {
    isLoading: boolean;
    evidences: IEvidence[];
    components: IComponents[];
    error: string | null;
    createComponent: (data: any) => Promise<any>;
    createEvidence: (data: any) => Promise<any>;
    getAllEvidences: () => Promise<any>;
    clearError: () => void;
    getComponents: () => Promise<any>;
}

export const useTasksStore = create<TasksState>((set) => ({
    isLoading: false,
    error: null,
    evidences: [],
    components: [],

    createComponent: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const createComponent = uploadComponentUseCase(tasksRepository);
            const result = await createComponent(data);
            set({ isLoading: false, error: null });
            return result;
        } catch (err: any) {
            set({
                isLoading: false,
                error:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al crear componente",
            });
            throw err;
        }
    },

    createEvidence: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const createEvidence = uploadEvidenceUseCase(tasksRepository);
            const result = await createEvidence(data);
            set({ isLoading: false });
            return result;
        } catch (err: any) {
            set({
                isLoading: false,
                error:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al crear evidencia",
            });
            throw err;
        }
    },

    getAllEvidences: async () => {
        set({ isLoading: true, error: null });
        try {
            const getAllEvidences = getAllEvidencesUseCase(tasksRepository);
            const result = await getAllEvidences();
            set({ isLoading: false, evidences: result.data });
            return result;
        } catch (err: any) {
            set({
                isLoading: false,
                error:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al obtener evidencias",
            });
            throw err;
        }
    },

    getComponents: async () => {
        set({ isLoading: true, error: null });
        try {
            const getUniqueComponents = getComponentsUseCase(tasksRepository);
            const result = await getUniqueComponents();
            set({ isLoading: false, components: result.data });
            return result;
        } catch (err: any) {
            set({
                isLoading: false,
                error:
                    err?.response?.data?.message ||
                    err?.message ||
                    "Error al obtener evidencias",
            });
            throw err;
        }
    },

    clearError: () => set({ error: null }),
}));
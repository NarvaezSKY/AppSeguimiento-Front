import { create } from "zustand";
import {
  uploadComponentUseCase,
  uploadEvidenceUseCase,
  getAllEvidencesUseCase,
  getComponentsUseCase,
  uploadActivityUseCase,
  updateEvidenceUseCase,
  getUsersByComponentUseCase,
} from "@/core/tasks/application";
import { tasksRepository } from "@/core/tasks/infrastructure/tasks.repository";
import { IEvidence } from "@/core/tasks/domain/upload-evidence";
import { IComponents } from "@/core/tasks/domain/get-components/get-components.res";
import { IGetAllEvidencesReq } from "@/core/tasks/domain/get-evidences";
import { IActivity } from "@/core/tasks/domain/upload-activity";
import { User } from "@/core/users/domain/get-all-users";

interface TasksState {
  isLoading: boolean;
  isUploadingActivity?: boolean;
  isUploadingEvidence?: boolean;
  evidences: IEvidence[];
  components: IComponents[];
  activities: IActivity[];
  usersInComponent?: User[];
  error: string | null;
  lastActivityId?: string | null;
  createComponent: (data: any) => Promise<any>;
  createEvidence: (data: any) => Promise<any>;
  uploadTask: (activityData: any, evidenceData: any) => Promise<any>;
  getAllEvidences: (filter?: IGetAllEvidencesReq) => Promise<any>;
  clearError: () => void;
  getComponents: () => Promise<any>;
  uploadActivity: (data: any) => Promise<any>;
  updateEvidence: (data: any) => Promise<any>;
  getUsersByComponent: (componentId: string) => Promise<any>;
}

export const useTasksStore = create<TasksState>((set) => ({
  isLoading: false,
  isUploadingActivity: false,
  isUploadingEvidence: false,
  error: null,
  evidences: [],
  components: [],
  activities: [],
  lastActivityId: null,

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

  getUsersByComponent: async (componentId: string) => {
    set({ isLoading: true, error: null });
    try {
      const getUsersByComponent = getUsersByComponentUseCase(tasksRepository);
      const result = await getUsersByComponent(componentId);
      set({ isLoading: false, error: null, usersInComponent: result.data });
      return result;
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al obtener usuarios",
      });
      throw err;
    }
  },

  updateEvidence: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const updateEvidence = updateEvidenceUseCase(tasksRepository);
      const result = await updateEvidence(data);
      set({ isLoading: false, error: null });
      return result;
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al actualizar evidencia",
      });
      throw err;
    }
  },

  uploadActivity: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const uploadActivity = uploadActivityUseCase(tasksRepository);
      const result = await uploadActivity(data);
      set({ isLoading: false, error: null });
      return result;
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al crear actividad",
      });
      throw err;
    }
  },

  // Upload both activity then evidence using the created activity id.
  uploadTask: async (activityData, evidenceData) => {
    // activityData: { componente, actividad, metaAnual }
    // evidenceData: whatever createEvidence expects; we'll append actividad (id)
    set({
      isLoading: true,
      error: null,
      isUploadingActivity: true,
      isUploadingEvidence: false,
    });
    try {
      const uploadActivity = uploadActivityUseCase(tasksRepository);
      const activityResult = await uploadActivity(activityData);
      // try to resolve created activity id from common shapes
      const ar: any = activityResult as any;
      const activityId =
        ar?.data?._id || ar?.data?.id || ar?._id || ar?.id || null;
      set({
        isUploadingActivity: false,
        isUploadingEvidence: true,
        lastActivityId: activityId,
      });

      const createEvidence = uploadEvidenceUseCase(tasksRepository);
      const evidencePayload = { ...evidenceData, actividad: activityId };
      const evidenceResult = await createEvidence(evidencePayload);

      set({ isUploadingEvidence: false, isLoading: false });
      return { activity: activityResult, evidence: evidenceResult };
    } catch (err: any) {
      set({
        isUploadingActivity: false,
        isUploadingEvidence: false,
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al subir tarea",
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

  getAllEvidences: async (filter?: IGetAllEvidencesReq) => {
    set({ isLoading: true, error: null });
    try {
      const getAll = getAllEvidencesUseCase(tasksRepository);
      const result = await getAll(filter);
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

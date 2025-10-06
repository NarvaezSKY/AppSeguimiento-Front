import { create } from "zustand";
import {
  uploadComponentUseCase,
  uploadEvidenceUseCase,
  getAllEvidencesUseCase,
  getComponentsUseCase,
  uploadActivityUseCase,
  updateEvidenceUseCase,
  getUsersByComponentUseCase,
  getActividadesByResponsableUseCase,
} from "@/core/tasks/application";
import { tasksRepository } from "@/core/tasks/infrastructure/tasks.repository";
import { IUploadEvidenceRes, IEvidence } from "@/core/tasks/domain/upload-evidence/upload-evidence.res";
import { IComponents } from "@/core/tasks/domain/get-components/get-components.res";
import { IGetAllEvidencesReq } from "@/core/tasks/domain/get-evidences";
import { IActivity } from "@/core/tasks/domain/upload-activity";
import { User } from "@/core/users/domain/get-all-users";
import { IActivityRes } from "@/core/tasks/domain/get-actividades-by-responsable";

interface TasksState {
  isLoading: boolean;
  isUploadingActivity?: boolean;
  isUploadingEvidence?: boolean;
  evidences: IEvidence[];
  components: IComponents[];
  activities: IActivity[];
  activitiesInProfile?: IActivityRes[];
  usersInComponent?: User[];
  error: string | null;
  lastActivityId?: string | null;
  lastComponentId?: string | null;

  // pagination
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;

  createComponent: (data: any) => Promise<any>;
  createEvidence: (data: any) => Promise<any>;
  uploadTask: (activityData: any, evidenceData: any) => Promise<any>;
  getAllEvidences: (filter?: IGetAllEvidencesReq) => Promise<any>;
  clearError: () => void;
  getComponents: () => Promise<any>;
  uploadActivity: (data: any) => Promise<any>;
  updateEvidence: (data: any) => Promise<any>;
  getUsersByComponent: (componentId: string) => Promise<any>;
  setLastComponentId: (componentId: string) => void;
  clearLastComponentId: () => void;
  getActividadesByResponsable: (responsableId: string) => Promise<any>;

  updatingEvidenceIds?: string[]; // NUEVO: ids en actualización
  // helper para hacer patch
  patchEvidenceInStore?: (evidence: IEvidence) => void;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  isLoading: false,
  isUploadingActivity: false,
  isUploadingEvidence: false,
  error: null,
  evidences: [],
  components: [],
  activities: [],
  lastActivityId: null,
  lastComponentId: null,

  // pagination defaults
  page: 1,
  limit: 10,
  totalItems: 0,
  totalPages: 0,
  updatingEvidenceIds: [],

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

  getActividadesByResponsable: async (responsableId: string) => {
    set({ isLoading: true, error: null });
    try {
      const getActividadesByResponsable = getActividadesByResponsableUseCase(tasksRepository);
      const result = await getActividadesByResponsable(responsableId);
      set({ isLoading: false, error: null, activitiesInProfile: result.data });
      return result;
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al obtener actividades",
      });
      throw err;
    }
  },

  setLastComponentId: (componentId: string) => set({ lastComponentId: componentId }),
  clearLastComponentId: () => set({ lastComponentId: null }),

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

  patchEvidenceInStore: (evidence: IEvidence) => {
    set((state) => {
      if (!state.evidences || state.evidences.length === 0) return {};
      return {
        evidences: state.evidences.map((ev) =>
          ev._id === evidence._id ? { ...ev, ...evidence } : ev
        ),
      };
    });
  },
  updateEvidence: async (data) => {
    const id = data.id || data._id;
    // No tocar isLoading global para no romper vistas/filtros
    set((state) => ({
      error: null,
      updatingEvidenceIds: [...(state.updatingEvidenceIds || []), id],
    }));
    try {
      const updateEvidence = updateEvidenceUseCase(tasksRepository);
      const result = await updateEvidence(data);

      // Normalizar posibles formas de respuesta
      const raw = (result as any)?.data ?? result;
      // Posibles ubicaciones de la/las evidencias actualizadas
      const candidates: any[] = [];
      if (Array.isArray(raw)) candidates.push(...raw);
      else if (Array.isArray(raw?.data)) candidates.push(...raw.data);
      else if (Array.isArray(raw?.items)) candidates.push(...raw.items);
      else if (raw?.data?.items && Array.isArray(raw.data.items))
        candidates.push(...raw.data.items);
      else if (raw?._id) candidates.push(raw);
      else if (raw?.data?._id) candidates.push(raw.data);

      // Patch de cada evidencia encontrada
      candidates.forEach((ev) => {
        if (ev && ev._id) get().patchEvidenceInStore?.(ev as IEvidence);
      });

      set((state) => ({
        updatingEvidenceIds: (state.updatingEvidenceIds || []).filter(
          (x) => x !== id
        ),
      }));
      return result;
    } catch (err: any) {
      set((state) => ({
        updatingEvidenceIds: (state.updatingEvidenceIds || []).filter(
          (x) => x !== id
        ),
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al actualizar evidencia",
      }));
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
    // evidenceData: either a single payload or an array of payloads
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

      if (Array.isArray(evidenceData)) {
        // create all evidences (in parallel)
        const payloads = evidenceData.map((p) => ({ ...p, actividad: activityId }));
        const promises = payloads.map((pl) => createEvidence(pl));
        const results = await Promise.all(promises);
        set({ isUploadingEvidence: false, isLoading: false });
        return { activity: activityResult, evidence: results };
      } else {
        const evidencePayload = { ...evidenceData, actividad: activityId };
        const evidenceResult = await createEvidence(evidencePayload);
        set({ isUploadingEvidence: false, isLoading: false });
        return { activity: activityResult, evidence: evidenceResult };
      }
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

      // Normalizar la respuesta a IUploadEvidenceRes (según ejemplo de API)
      // API: { success: true, data: { items: [...], total, page, totalPages, perPage } }
      // repository devuelve response.data (el objeto completo), por eso navegamos result?.data
      const maybeTop = result as any;
      // si repository ya devolvió response.data (ej: { success, data: {...} }) -> inner = result.data
      // si useCase/repository devolviera ya inner -> inner = result
      const topLayer = maybeTop?.data ?? maybeTop;
      const inner: IUploadEvidenceRes["data"] | any = topLayer?.data ?? topLayer;

      // items garantizados como IEvidence[]
      const items: IEvidence[] = Array.isArray(inner?.items)
        ? inner.items
        : Array.isArray(inner)
        ? (inner as IEvidence[])
        : [];

      const page = Number(inner?.page ?? filter?.page ?? 1);
      const limit = Number(inner?.perPage ?? inner?.perPage ?? filter?.limit ?? 10);
      const totalItems = Number(inner?.total ?? 0);
      const totalPages = Number(inner?.totalPages ?? Math.ceil(totalItems / (limit || 1)) ?? 0);

      set({
        isLoading: false,
        evidences: items,
        page,
        limit,
        totalItems,
        totalPages,
      });

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

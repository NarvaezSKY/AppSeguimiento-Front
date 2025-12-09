import { create } from "zustand";
import { usersRepository } from "@/core/users/infrastructure/users.repository";
import { IUploadUserReq } from "@/core/users/domain/upload-user";
import { IGetAllUsersRes, User } from "@/core/users/domain/get-all-users";
import { uploadUserUseCase, getAllUsersUseCase } from "@/core/users/application";

interface UsersState {
    isLoading: boolean;
    error: string | null;
    users: User[];
    uploadUser: (data: IUploadUserReq) => Promise<any>;
    getAllUsers: () => Promise<IGetAllUsersRes>;
    clearError: () => void;
    clearUsers: () => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  isLoading: false,
  error: null,
  users: [],

  uploadUser: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const result = await uploadUserUseCase(usersRepository)(data);
      set({ isLoading: false });
      return result;
    } catch (err: any) {
      set({
        isLoading: false,
        error:
          err?.response?.data?.message ||
          err?.message ||
          "Error al crear usuario",
      });
      throw err;
    }
  },

  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getAllUsersUseCase(usersRepository)();
      set({ isLoading: false, users: result.data });
      return result as IGetAllUsersRes;
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

  clearError: () => set({ error: null }),
  
  clearUsers: () => set({ users: [], error: null }),
}));
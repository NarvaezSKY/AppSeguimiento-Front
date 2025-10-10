import { create } from "zustand";
import { usersRepository } from "@/core/users/infrastructure/users.repository";
import { IUploadUserReq } from "@/core/users/domain/upload-user";
import { IGetAllUsersRes, User } from "@/core/users/domain/get-all-users";
import { uploadUserUseCase, getAllUsersUseCase } from "@/core/users/application";
import { persist, createJSONStorage } from "zustand/middleware"; // <-- add

interface UsersState {
    isLoading: boolean;
    error: string | null;
    users: User[];
    usersLoaded: boolean;                   // <-- add
    uploadUser: (data: IUploadUserReq) => Promise<any>;
    getAllUsers: () => Promise<IGetAllUsersRes>;
    getAllUsersIfNeeded: () => Promise<void>; // <-- add
    clearError: () => void;
}

// Replace create(...) with a persisted store
export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      error: null,
      users: [],
      usersLoaded: false, // <-- add

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
        // optional early-return when already loaded
        if (get().usersLoaded && (get().users?.length ?? 0) > 0) {
          return { success: true, data: get().users } as IGetAllUsersRes;
        }
        set({ isLoading: true, error: null });
        try {
          const result = await getAllUsersUseCase(usersRepository)();
          set({ isLoading: false, users: result.data, usersLoaded: true }); // mark as loaded
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

      // new helper to avoid redundant calls
      getAllUsersIfNeeded: async () => {
        if (get().usersLoaded && (get().users?.length ?? 0) > 0) return;
        await get().getAllUsers();
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "users-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        usersLoaded: state.usersLoaded,
      }),
    }
  )
);
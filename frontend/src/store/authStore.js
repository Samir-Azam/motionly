// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authAPI } from "../api/auth";
import { userAPI } from "../api/user";
import toast from "react-hot-toast";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      fetchCurrentUser: async () => {
        try {
          set({ isLoading: true });
          const response = await userAPI.getCurrentUser();
          // ApiResponse: { statusCode, data, message, success }
          const user = response.data?.data || null;

          if (user) {
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      login: async (credentials) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.login(credentials);
          const user = response.data?.data || null;

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          toast.success(response.data?.message || "Login successful!");
          return response;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (formData) => {
        try {
          set({ isLoading: true });
          const response = await authAPI.register(formData);
          const user = response.data?.data || null;

          set({
            user,
            isAuthenticated: !!user,
            isLoading: false,
          });

          toast.success(
            response.data?.message || "Account created successfully!"
          );
          return response.data;
        } catch (error) {
          console.error("Register error:", error);
          console.error("Error response:", error.response?.data);

          const errorMessage =
            error.response?.data?.message ||
            error.message ||
            "Registration failed";

          toast.error(errorMessage);
          set({ isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
          set({ user: null, isAuthenticated: false });
          toast.success("Logged out successfully!");
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },

      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

import api from "./axios";

export const authAPI = {
  register: async (formData) => {
    const response = await api.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response;
  },

  logout: async () => {
    const response = await api.post("/auth/logout");
    return response;
  },

  refreshToken: async () => {
    const response = await api.post("/auth/refresh-token");
    return response;
  },
};

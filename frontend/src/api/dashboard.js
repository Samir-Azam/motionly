import api from "./axios";

export const dashboardAPI = {
  getDashboardStats: async () => {
    const response = await api.get("/dashboard");
    return response;
  },
};

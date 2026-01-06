import api from "./axios";

export const watchHistoryAPI = {
  getWatchHistory: async (page = 1, limit = 20) => {
    const response = await api.get(
      `/watch-history?page=${page}&limit=${limit}`
    );
    return response;
  },

  addToWatchHistory: async (id) => {
  const response = await api.post(`/watch-history/${id}`);
  return response;
  },

  clearWatchHistory: async () => {
    const response = await api.delete("/watch-history/clear");
    return response;
  },
};

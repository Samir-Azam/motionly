import api from "./axios";

export const searchAPI = {
  search: async (query) => {
    const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    return response;
  },
};

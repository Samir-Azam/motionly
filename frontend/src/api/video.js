import api from "./axios";

export const videoAPI = {
  uploadVideo: async (formData) => {
    const response = await api.post("/videos/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  getAllVideos: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/videos/feed/all?page=${page}&limit=${limit}`
    );
    return response;
  },

  getVideoById: async (id) => {
    const response = await api.get(`/videos/${id}`);
    return response;
  },

  getVideosByUsername: async (username, page = 1, limit = 10) => {
    const response = await api.get(
      `/videos/user/${username}?page=${page}&limit=${limit}`
    );
    return response;
  },

  updateVideo: async (id, data) => {
    const response = await api.patch(`/videos/update/${id}`, data, {
      headers:
        data instanceof FormData
          ? {
              "Content-Type": "multipart/form-data",
            }
          : undefined,
    });
    return response;
  },

  deleteVideo: async (id) => {
    const response = await api.delete(`/videos/delete/${id}`);
    return response;
  },
};

import api from "./axios";

export const likeAPI = {
  toggleLike: async (targetType, targetId) => {
    const response = await api.post("/likes/toggle", {
      targetType,
      targetId,
    });
    return response;
  },

  getLikeCount: async (targetType, targetId) => {
    const response = await api.get(`/likes/count/${targetType}/${targetId}`);
    return response;
  },

  getLikeStatus: async (targetType, targetId) => {
    const response = await api.get(`/likes/status/${targetType}/${targetId}`);
    return response;
  },
};

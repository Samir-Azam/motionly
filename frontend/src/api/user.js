import api from "./axios";

export const userAPI = {
  getCurrentUser: async () => {
    const response = await api.get("/users/me");
    return response;
  },

  updateAccountDetails: async (data) => {
    const response = await api.patch("/users/update-account", data);
    return response;
  },

  updateAvatar: async (formData) => {
    const response = await api.patch("/users/update-avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  updateCoverImage: async (formData) => {
    const response = await api.patch("/users/update-cover-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  },

  resetPassword: async (data) => {
    const response = await api.post("/users/reset-password", data);
    return response;
  },

  getChannelProfile: async (username) => {
    const response = await api.get(`/users/profile/${username}`);
    return response;
  },

  deleteAccount: async () => {
    const response = await api.delete("/users/delete-account");
    return response;
  },
};

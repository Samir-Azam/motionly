import api from "./axios";

export const playlistAPI = {
  createPlaylist: async (data) => {
    const response = await api.post("/playlists", data);
    return response;
  },

  getMyPlaylists: async (page = 1, limit = 10) => {
    const response = await api.get(
      `/playlists/mine?page=${page}&limit=${limit}`
    );
    return response;
  },

  getPlaylistById: async (playlistId) => {
    const response = await api.get(`/playlists/${playlistId}`);
    return response;
  },

  addVideoToPlaylist: async (playlistId, videoId) => {
    const response = await api.post("/playlists/add-video", {
      playlistId,
      videoId,
    });
    return response;
  },

  removeVideoFromPlaylist: async (playlistId, videoId) => {
    const response = await api.delete("/playlists/remove-video", {
      data: { playlistId, videoId },
    });
    return response;
  },

  updatePlaylist: async (playlistId, data) => {
    const response = await api.patch(`/playlists/${playlistId}`, data);
    return response;
  },

  deletePlaylist: async (playlistId) => {
    const response = await api.delete(`/playlists/${playlistId}`);
    return response;
  },
};

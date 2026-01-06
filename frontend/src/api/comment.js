import api from "./axios";

export const commentAPI = {
  // ✅ Changed to match backend route /add
  addVideoComment: async (videoId, content, parentComment = null) => {
    const response = await api.post("/comments/add", {
      // ✅ Added /add
      videoId,
      content,
      parentComment,
    });
    return response;
  },

  // ✅ Get video comments - route is /comments/:videoId
  getVideoComments: async (videoId) => {
    const response = await api.get(`/comments/${videoId}`);
    return response;
  },

  // ✅ Get replies
  getReplies: async (commentId) => {
    const response = await api.get(`/comments/replies/${commentId}`);
    return response;
  },

  // ✅ Delete comment
  deleteComment: async (commentId) => {
    const response = await api.delete(`/comments/${commentId}`);
    return response;
  },

  // ✅ Update comment
  updateComment: async (commentId, content) => {
    const response = await api.patch(`/comments/${commentId}`, { content });
    return response;
  },
};

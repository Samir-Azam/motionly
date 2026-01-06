// src/api/subscription.js
import api from "./axios";

export const subscriptionAPI = {
  // Toggle subscription (follow/unfollow)
  toggleSubscription: async (channelId) => {
    const response = await api.post(`/subscriptions/toggle/${channelId}`);
    return response;
  },

  // Check if subscribed to a channel
  checkSubscription: async (channelId) => {
    const response = await api.get(`/subscriptions/status/${channelId}`);
    return response;
  },

  // ✅ Change this name or add an alias
  getMySubscriptions: async (page = 1, limit = 20) => {
    const response = await api.get(
      `/subscriptions/my/channels?page=${page}&limit=${limit}`
    );
    return response;
  },

  getUserSubscriptions: async (page = 1, limit = 20) => {
    const response = await api.get(
      `/subscriptions/my/channels?page=${page}&limit=${limit}`
    );
    return response;
  },

  // Get subscribers of a channel
  getSubscribers: async (channelId, page = 1, limit = 20) => {
    const response = await api.get(
      `/subscriptions/subscribers/${channelId}?page=${page}&limit=${limit}`
    );
    return response;
  },

  // Get channels subscribed by a user
  getChannelSubscriptions: async (channelId, page = 1, limit = 20) => {
    const response = await api.get(
      `/subscriptions/channels/${channelId}?page=${page}&limit=${limit}`
    );
    return response;
  },
};

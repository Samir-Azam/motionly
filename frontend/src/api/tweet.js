import api from "./axios";

export const tweetAPI = {
  // Get tweet feed (personalized if logged in, public if not)
  getTweetFeed: async (page = 1, limit = 20) => {
    const response = await api.get(`/tweets/feed?page=${page}&limit=${limit}`);
    return response;
  },

  getPersonalizedFeed: async (page = 1, limit = 20) => {
    const response = await api.get(`/tweets/following?page=${page}&limit=${limit}`);
    return response;
  },

  // Get tweets by specific user
  getUserTweets: async (username, page = 1, limit = 20) => {
    const response = await api.get(
      `/tweets/user/${username}?page=${page}&limit=${limit}`
    );
    return response;
  },

  // Create tweet
  createTweet: async (content) => {
    const response = await api.post("/tweets", { content });
    return response;
  },

  // Delete tweet
  deleteTweet: async (tweetId) => {
    const response = await api.delete(`/tweets/${tweetId}`);
    return response;
  },

  // Like/Unlike tweet
  toggleTweetLike: async (tweetId) => {
    const response = await api.post(`/tweets/${tweetId}/like`);
    return response;
  },
};

import { create } from "zustand";

export const useSubscriptionStore = create((set, get) => ({
  subscriptions: new Set(), // Set of channel IDs user is subscribed to

  // Initialize subscriptions (call on app load)
  setSubscriptions: (channelIds) =>
    set({
      subscriptions: new Set(channelIds),
    }),

  // Add a subscription
  addSubscription: (channelId) =>
    set((state) => {
      const newSubscriptions = new Set(state.subscriptions);
      newSubscriptions.add(channelId);
      return { subscriptions: newSubscriptions };
    }),

  // Remove a subscription
  removeSubscription: (channelId) =>
    set((state) => {
      const newSubscriptions = new Set(state.subscriptions);
      newSubscriptions.delete(channelId);
      return { subscriptions: newSubscriptions };
    }),

  // Check if subscribed
  isSubscribed: (channelId) => {
    return get().subscriptions.has(channelId);
  },

  // Toggle subscription
  toggleSubscription: (channelId) => {
    const state = get();
    if (state.subscriptions.has(channelId)) {
      state.removeSubscription(channelId);
      return false; // now unsubscribed
    } else {
      state.addSubscription(channelId);
      return true; // now subscribed
    }
  },
}));

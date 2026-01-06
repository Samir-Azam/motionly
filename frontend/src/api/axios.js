// src/api/axios.js
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // Check if refresh was successful
        if (refreshResponse.status === 200) {
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth state and redirect to login
        // Only redirect if NOT already on login/register page
        if (
          !window.location.pathname.includes("/login") &&
          !window.location.pathname.includes("/register")
        ) {
          // Clear auth storage
          localStorage.removeItem("auth-storage");

          // Show message
          toast.error("Session expired. Please login again.");

          // Redirect after a small delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 100);
        }
        return Promise.reject(refreshError);
      }
    }

    // Don't show toast for 401 errors (handled above)
    if (error.response?.status !== 401) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

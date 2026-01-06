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

// Track if we're already refreshing to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

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

    // Don't handle 401 for auth endpoints
    const isAuthEndpoint =
      originalRequest.url?.includes("/auth/login") ||
      originalRequest.url?.includes("/auth/register") ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/current-user");

    // If error is 401 and NOT an auth endpoint
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Try to refresh the token
        const refreshResponse = await axios.post(
          `${API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        if (refreshResponse.status === 200) {
          isRefreshing = false;
          processQueue(null);
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed
        isRefreshing = false;
        processQueue(refreshError, null);

        // Only show message and redirect if NOT on login/register page
        const isPublicPage =
          window.location.pathname === "/login" ||
          window.location.pathname === "/register" ||
          window.location.pathname === "/";

        if (!isPublicPage) {
          // Clear auth storage
          localStorage.removeItem("auth-storage");

          // Show message
          toast.error("Session expired. Please login again.");

          // Redirect after a small delay
          setTimeout(() => {
            window.location.href = "/login";
          }, 500);
        }

        return Promise.reject(refreshError);
      }
    }

    // Don't show toast for 401 errors (handled above) or 404
    if (error.response?.status !== 401 && error.response?.status !== 404) {
      const message = error.response?.data?.message || "Something went wrong";
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

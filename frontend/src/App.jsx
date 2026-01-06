// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { useSubscriptionStore } from "./store/subscriptionStore";
import { subscriptionAPI } from "./api/subscription";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VideoPlayer from "./pages/VideoPlayer";
import ChannelProfile from "./pages/ChannelProfile";
import UploadVideo from "./pages/UploadVideo";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Dashboard from "./pages/Dashboard";
import Playlists from "./pages/Playlists";
import PlaylistView from "./pages/PlaylistView";
import WatchHistory from "./pages/WatchHistory";
import Tweets from "./pages/Tweets";
import Subscriptions from "./pages/Subscriptions";
import NotFound from "./pages/NotFound";

// Components
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { setSubscriptions } = useSubscriptionStore();

  // Fetch current user on mount
  useEffect(() => {
    useAuthStore.getState().fetchCurrentUser();
  }, []);

  // Load subscriptions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSubscriptions();
    } else {
      // Clear subscriptions on logout
      setSubscriptions([]);
    }
  }, [isAuthenticated]);

  const loadSubscriptions = async () => {
    try {
      const response = await subscriptionAPI.getUserSubscriptions();
      const subs = response.data?.data?.docs || response.data?.data || [];

      // Extract channel IDs
      const channelIds = subs.map((sub) => {
        const channel = sub.channel || sub;
        return channel._id;
      });

      console.log("✅ Loaded subscriptions:", channelIds.length);
      setSubscriptions(channelIds);
    } catch (error) {
      console.error("❌ Load subscriptions error:", error);
      setSubscriptions([]);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="pt-16">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Register />
              }
            />
            <Route path="/watch/:id" element={<VideoPlayer />} />
            <Route path="/channel/:username" element={<ChannelProfile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/playlist/:id" element={<PlaylistView />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/upload" element={<UploadVideo />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/playlists" element={<Playlists />} />
              <Route path="/history" element={<WatchHistory />} />
              <Route path="/tweets" element={<Tweets />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;

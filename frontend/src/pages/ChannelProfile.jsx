import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { userAPI } from "../api/user";
import { videoAPI } from "../api/video";
import { subscriptionAPI } from "../api/subscription";
import VideoCard from "../components/video/VideoCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Users, Video, Bell, ChevronDown } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";

const ChannelProfile = () => {
  const { username } = useParams();
  const { isAuthenticated, user } = useAuthStore();
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showUnsubscribeMenu, setShowUnsubscribeMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    fetchChannelData();
    fetchChannelVideos();
  }, [username]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUnsubscribeMenu(false);
      }
    };

    if (showUnsubscribeMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showUnsubscribeMenu]);

  const fetchChannelData = async () => {
    try {
      const response = await userAPI.getChannelProfile(username);

      console.log("Channel response:", response);

      // Handle ApiResponse wrapper
      const data = response.data?.data || response.data;

      console.log("Channel data:", data);

      setChannelData(data);
    } catch (error) {
      console.error("Error fetching channel:", error);
      console.error("Error details:", error.response?.data);
    }
  };

  const fetchChannelVideos = async () => {
    try {
      setIsLoading(true);
      const response = await videoAPI.getVideosByUsername(username);

      // Handle ApiResponse wrapper
      const videosData = response.data?.data?.docs || response.data?.docs || [];

      setVideos(videosData);
    } catch (error) {
      console.error("Error fetching videos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      return;
    }

    // Don't allow subscribing to own channel
    if (user?.username === username) {
      toast.error("You cannot subscribe to your own channel");
      return;
    }

    const channelId = channel._id;
    if (!channelId) {
      console.error("No channel ID found");
      return;
    }

    setIsSubscribing(true);
    try {
      const response = await subscriptionAPI.toggleSubscription(channelId);

      console.log("Subscribe response:", response);

      const isNowSubscribed = response.data?.data?.isSubscribed || false;

      // Update local state
      setChannelData((prev) => ({
        ...prev,
        isSubscribed: isNowSubscribed,
        subscriberCount: isNowSubscribed
          ? (prev.subscriberCount || 0) + 1
          : Math.max((prev.subscriberCount || 0) - 1, 0),
      }));

      toast.success(isNowSubscribed ? "Subscribed!" : "Unsubscribed");
      setShowUnsubscribeMenu(false);
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error("Failed to update subscription");
    } finally {
      setIsSubscribing(false);
    }
  };

  if (isLoading && !channelData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!channelData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Channel not found</p>
      </div>
    );
  }

  const channel = channelData.channel || channelData;
  const subscriberCount =
    channelData.subscriberCount || channelData.subscribersCount || 0;
  const videoCount =
    channelData.videoCount || channelData.videosCount || videos.length;
  const isSubscribed = channelData.isSubscribed || false;
  const isOwnChannel = user?.username === username;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Channel Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        {/* Cover Image */}
        {channel.coverImage && (
          <div className="h-48 bg-gradient-to-r from-primary-400 to-primary-600">
            <img
              src={channel.coverImage}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Channel Info */}
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <img
              src={channel.avatar || "/default-avatar.png"}
              alt={channel.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white -mt-12"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="flex-1 mt-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {channel.fullName || channel.username}
              </h1>
              <p className="text-gray-600">@{channel.username}</p>

              <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{subscriberCount} subscribers</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Video className="w-4 h-4" />
                  <span>{videoCount} videos</span>
                </div>
              </div>
            </div>

            {/* Subscribe/Unsubscribe Buttons */}
            {isAuthenticated && !isOwnChannel && (
              <div className="relative" ref={menuRef}>
                {isSubscribed ? (
                  <div className="flex items-center space-x-2">
                    {/* Subscribed Button with Bell Icon */}
                    <button
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      disabled={isSubscribing}
                    >
                      <Bell className="w-4 h-4" />
                      <span>Subscribed</span>
                    </button>

                    {/* Dropdown Toggle */}
                    <button
                      onClick={() =>
                        setShowUnsubscribeMenu(!showUnsubscribeMenu)
                      }
                      className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      disabled={isSubscribing}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    {/* Unsubscribe Dropdown */}
                    {showUnsubscribeMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                        <button
                          onClick={handleSubscribe}
                          disabled={isSubscribing}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {isSubscribing ? "Unsubscribing..." : "Unsubscribe"}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={handleSubscribe}
                    disabled={isSubscribing}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                )}
              </div>
            )}

            {/* Show login prompt if not authenticated */}
            {!isAuthenticated && !isOwnChannel && (
              <button
                onClick={() => toast.error("Please login to subscribe")}
                className="btn-primary"
              >
                Subscribe
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Videos */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Videos</h2>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No videos yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChannelProfile;

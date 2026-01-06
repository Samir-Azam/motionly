import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { videoAPI } from "../api/video";
import { likeAPI } from "../api/like";
import { watchHistoryAPI } from "../api/watchHistory";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CommentSection from "../components/comment/CommentSection";
import { Eye, Calendar, Heart, List } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import AddToPlaylistModal from "../components/playlist/AddToPlaylistModal";

const VideoPlayer = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuthStore();
  const [video, setVideo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);

  useEffect(() => {
    fetchVideo();
    if (isAuthenticated) {
      addToHistory();
      checkLikeStatus();
    }
  }, [id, isAuthenticated]);

  // Fetch related videos when video loads
  useEffect(() => {
    if (video) {
      fetchRelatedVideos();
    }
  }, [video]);

  const fetchVideo = async () => {
    try {
      setIsLoading(true);
      const response = await videoAPI.getVideoById(id);

      const videoData = response.data?.data || response.data;
      setVideo(videoData);
    } catch (error) {
      console.error("Error fetching video:", error);
      toast.error("Failed to load video");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRelatedVideos = async () => {
    try {
      if (!video?.owner?.username) return;

      const response = await videoAPI.getVideosByUsername(video.owner.username);
      const videosData = response.data?.data?.docs || response.data?.docs || [];

      // Filter out current video and limit to 10
      const filtered = videosData.filter((v) => v._id !== id).slice(0, 10);

      setRelatedVideos(filtered);
    } catch (error) {
      console.error("Related videos error:", error);
    }
  };

  const addToHistory = async () => {
    try {
      if (!id) {
        console.error("No video ID from params");
        return;
      }

      await watchHistoryAPI.addToWatchHistory(id);
    } catch (error) {
      console.error("Watch history error:", error);
    }
  };

  const checkLikeStatus = async () => {
    try {
      const [countRes, statusRes] = await Promise.all([
        likeAPI.getLikeCount("video", id),
        likeAPI.getLikeStatus("video", id),
      ]);

      const count =
        countRes.data?.data?.likeCount ||
        countRes.data?.data?.count ||
        countRes.data?.count ||
        0;

      const liked =
        statusRes.data?.data?.isLiked || statusRes.data?.isLiked || false;

      setLikes(count);
      setIsLiked(liked);
    } catch (error) {
      console.error("Like check error:", error);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like videos");
      return;
    }

    try {
      const videoId = video?._id;

      if (!videoId) {
        console.error("No video ID available");
        return;
      }

      // ✅ Use likeAPI instead of raw axios
      const response = await likeAPI.toggleLike("video", videoId);

      if (response.data.success) {
        const liked = response.data.data?.isLiked ?? !isLiked;
        const count =
          response.data.data?.likeCount ?? (liked ? likes + 1 : likes - 1);

        setIsLiked(liked);
        setLikes(count);

        toast.success(liked ? "Liked! ❤️" : "Unliked");
      }
    } catch (error) {
      console.error("Like error:", error);
      toast.error(error.response?.data?.message || "Failed to update like");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-2">Video not found</p>
          <p className="text-gray-400 text-sm">
            The video may have been deleted or is unavailable
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Video Player */}
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <video
              controls
              autoPlay
              className="w-full h-full"
              src={video.videoFile}
              poster={video.thumbnail}
              onError={(e) => {
                console.error("Video playback error:", e);
                toast.error("Failed to load video. Check video URL.");
              }}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold text-gray-900">{video.title}</h1>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-gray-600">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{video.views || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {(() => {
                      try {
                        const date = new Date(video.createdAt);
                        return date.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        });
                      } catch (error) {
                        console.error("Date parsing error:", video.createdAt);
                        return "Unknown date";
                      }
                    })()}
                  </span>
                </div>
              </div>

              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span>{likes}</span>
                  </button>

                  <button
                    onClick={() => setShowPlaylistModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <List className="w-5 h-5" />
                    <span>Save</span>
                  </button>
                </div>
              )}
            </div>

            {/* Channel Info */}
            {video.owner && (
              <div className="flex items-center space-x-3 mt-4 p-4 bg-gray-50 rounded-lg">
                <img
                  src={video.owner.avatar || "/default-avatar.png"}
                  alt={video.owner.username}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {video.owner.fullName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    @{video.owner.username}
                  </p>
                </div>
              </div>
            )}

            {/* Description */}
            {video.description && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            )}

            {/* Comments */}
            <CommentSection videoId={id} />
          </div>
        </div>

        {/* Sidebar - Related Videos */}
        <div className="lg:col-span-1">
          <h3 className="font-semibold text-gray-900 mb-4">Related Videos</h3>
          <div className="space-y-4">
            {relatedVideos.length > 0 ? (
              relatedVideos.map((relatedVideo) => (
                <Link
                  key={relatedVideo._id}
                  to={`/watch/${relatedVideo._id}`}
                  className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg transition"
                >
                  <img
                    src={relatedVideo.thumbnail}
                    alt={relatedVideo.title}
                    className="w-40 h-24 object-cover rounded-lg flex-shrink-0"
                    onError={(e) => {
                      e.target.src = "/default-thumbnail.png";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 line-clamp-2 mb-1">
                      {relatedVideo.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {relatedVideo.owner?.username}
                    </p>
                    <p className="text-xs text-gray-500">
                      {relatedVideo.views || 0} views
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No related videos yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <AddToPlaylistModal
          videoId={id}
          onClose={() => setShowPlaylistModal(false)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;

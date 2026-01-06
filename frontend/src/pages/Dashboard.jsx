import { useState, useEffect } from "react";
import { dashboardAPI } from "../api/dashboard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Video, Users, Heart, List, Eye } from "lucide-react";
import VideoCard from "../components/video/VideoCard";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardAPI.getDashboardStats();

      console.log("Dashboard response:", response); // ✅ Debug

      // ✅ Handle ApiResponse format
      const dashboardData = response.data?.data || response.data;
      console.log("Dashboard data:", dashboardData); // ✅ Debug

      setStats(dashboardData);
    } catch (error) {
      console.error("Dashboard error:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Creator Dashboard
      </h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Videos</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalVideos || 0}
              </p>
            </div>
            <Video className="w-12 h-12 text-primary-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Subscribers</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalSubscribers || 0}
              </p>
            </div>
            <Users className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Likes</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalLikes || 0}
              </p>
            </div>
            <Heart className="w-12 h-12 text-red-600" />
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalViews || 0}
              </p>
            </div>
            <Eye className="w-12 h-12 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Recent Uploads */}
      {stats.recentUploads && stats.recentUploads.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Uploads
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {stats.recentUploads.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Comments */}
      {stats.recentComments && stats.recentComments.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Recent Comments
          </h2>
          <div className="space-y-4">
            {stats.recentComments.map((comment) => (
              <div key={comment._id} className="card">
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={comment.owner?.avatar || "/default-avatar.png"}
                    alt={comment.owner?.username}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-sm">
                      {comment.owner?.fullName || comment.owner?.username}
                    </p>
                    {comment.video && (
                      <p className="text-xs text-gray-500">
                        on "{comment.video.title}"
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-gray-700">{comment.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import { useState, useEffect } from "react";
import { watchHistoryAPI } from "../api/watchHistory";
import VideoCard from "../components/video/VideoCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Clock, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const response = await watchHistoryAPI.getWatchHistory();

      console.log("Watch history response:", response); // ✅ Debug

      // ✅ Handle ApiResponse wrapper + pagination
      const historyData =
        response.data?.data?.docs ||
        response.data?.docs ||
        response.data?.data ||
        [];

      console.log("History data:", historyData); // ✅ Debug

      setHistory(historyData);
    } catch (error) {
      console.error("Watch history error:", error);
      toast.error("Failed to load watch history");
    } finally {
      setIsLoading(false);
    }
  };


  const handleClearHistory = async () => {
    if (window.confirm("Are you sure you want to clear your watch history?")) {
      try {
        await watchHistoryAPI.clearWatchHistory();
        setHistory([]);
        toast.success("Watch history cleared");
      } catch (error) {
        console.error("Clear history error:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Clock className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Watch History</h1>
        </div>
        {history.length > 0 && (
          <button
            onClick={handleClearHistory}
            className="flex items-center space-x-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-5 h-5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((item) => (
            <VideoCard key={item._id} video={item.video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No watch history yet</p>
        </div>
      )}
    </div>
  );
};

export default WatchHistory;

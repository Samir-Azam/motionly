import { useState, useEffect } from "react";
import { videoAPI } from "../api/video";
import VideoCard from "../components/video/VideoCard";
import LoadingSpinner from "../components/common/LoadingSpinner";

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchVideos(page);
  }, [page]);

  const fetchVideos = async (currentPage) => {
    try {
      setIsLoading(true);
      const response = await videoAPI.getAllVideos(currentPage, 12);

      console.log("Full response:", response);
      console.log("Video data:", response.data?.data);

      const videoData = response.data?.data;

      if (videoData && videoData.docs) {
        // ✅ Fixed: Replace on page 1, append on subsequent pages
        setVideos(
          (prev) =>
            currentPage === 1
              ? videoData.docs // Replace for first page
              : [...prev, ...videoData.docs] // Append for other pages
        );
        setHasMore(videoData.hasNextPage || false);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
      console.error("Error response:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Trending Videos</h1>

      {isLoading && page === 1 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No videos found</p>
              <p className="text-gray-400 text-sm mt-2">
                Be the first to upload a video!
              </p>
            </div>
          )}

          {hasMore && videos.length > 0 && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={isLoading}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

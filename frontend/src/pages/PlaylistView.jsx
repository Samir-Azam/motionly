import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { playlistAPI } from "../api/playlist";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { List, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

const PlaylistView = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [removingVideoId, setRemovingVideoId] = useState(null);

  useEffect(() => {
    fetchPlaylist();
  }, [id]);

  const fetchPlaylist = async () => {
    try {
      setIsLoading(true);
      const response = await playlistAPI.getPlaylistById(id);

      const playlistData = response.data?.data || response.data;
      setPlaylist(playlistData);
    } catch (error) {
      console.error("Playlist error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveVideo = async (videoId) => {
    if (!window.confirm("Remove this video from playlist?")) return;

    setRemovingVideoId(videoId);
    try {
      await playlistAPI.removeVideoFromPlaylist(id, videoId);
      toast.success("Video removed from playlist");

      // Refresh playlist
      await fetchPlaylist();
    } catch (error) {
      console.error("Remove video error:", error);
      toast.error("Failed to remove video");
    } finally {
      setRemovingVideoId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Playlist not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card mb-8">
        <div className="flex items-start space-x-4">
          <List className="w-16 h-16 text-primary-600" />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="text-gray-600">{playlist.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {playlist.videos?.length || 0} videos
            </p>
          </div>
        </div>
      </div>

      {playlist.videos && playlist.videos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {playlist.videos.map((item) => {
            const video = item.video || item;
            const isRemoving = removingVideoId === video._id;

            return (
              <div key={item._id} className="relative group">
                <Link
                  to={`/watch/${video._id}`}
                  className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {video.owner?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {video.views || 0} views
                    </p>
                  </div>
                </Link>

                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  disabled={isRemoving}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 disabled:opacity-50"
                  title="Remove from playlist"
                >
                  {isRemoving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No videos in this playlist</p>
        </div>
      )}
    </div>
  );
};

export default PlaylistView;

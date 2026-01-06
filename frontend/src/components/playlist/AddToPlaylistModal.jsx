import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { playlistAPI } from "../../api/playlist";
import { X, Plus, Check } from "lucide-react";
import toast from "react-hot-toast";

const AddToPlaylistModal = ({ videoId, onClose }) => {
  const navigate = useNavigate();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      const response = await playlistAPI.getMyPlaylists();
      console.log("Playlists response:", response);

      const playlistsData =
        response.data?.data?.docs ||
        response.data?.docs ||
        response.data?.data ||
        response.data ||
        [];

      console.log("Playlists data:", playlistsData);
      setPlaylists(playlistsData);
    } catch (error) {
      console.error("Fetch playlists error:", error);
      toast.error("Failed to load playlists");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleVideo = async (playlistId, isInPlaylist) => {
    setProcessingId(playlistId);
    try {
      if (isInPlaylist) {
        await playlistAPI.removeVideoFromPlaylist(playlistId, videoId);
        toast.success("Removed from playlist");
      } else {
        console.log("Adding video:", { playlistId, videoId });
        await playlistAPI.addVideoToPlaylist(playlistId, videoId);
        toast.success("Added to playlist");
      }

      // Refresh playlists
      await fetchPlaylists();
    } catch (error) {
      console.error("Toggle playlist error:", error);
      console.error("Error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to update playlist";

      toast.error(errorMessage);
    } finally {
      setProcessingId(null);
    }
  };

  const handleCreatePlaylist = () => {
    onClose(); // Close modal first
    navigate("/playlists"); // Navigate to playlists page
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Save to playlist</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-96">
          {isLoading ? (
            <p className="text-center text-gray-500">Loading playlists...</p>
          ) : playlists.length > 0 ? (
            <div className="space-y-2">
              {playlists.map((playlist) => {
                // Check if video is in playlist
                const isInPlaylist = playlist.videos?.some((item) => {
                  const vid = item.video || item;
                  return vid._id === videoId || vid === videoId;
                });

                const isProcessing = processingId === playlist._id;

                console.log(
                  "Playlist:",
                  playlist.name,
                  "Has video:",
                  isInPlaylist
                );

                return (
                  <button
                    key={playlist._id}
                    onClick={() =>
                      handleToggleVideo(playlist._id, isInPlaylist)
                    }
                    disabled={isProcessing}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition disabled:opacity-50"
                  >
                    <div className="flex items-center space-x-3">
                      {isInPlaylist ? (
                        <Check className="w-5 h-5 text-primary-600" />
                      ) : (
                        <Plus className="w-5 h-5 text-gray-400" />
                      )}
                      <div className="text-left">
                        <span className="text-sm font-medium block">
                          {playlist.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {playlist.videos?.length || 0} videos
                        </span>
                      </div>
                    </div>
                    {isProcessing && (
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No playlists yet</p>
              <button
                onClick={handleCreatePlaylist}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Create a playlist
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;

import { useState, useEffect } from "react";
import { playlistAPI } from "../api/playlist";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { List, Plus, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";
import EditPlaylistModal from "../components/playlist/EditPlaylistModal";
import toast from "react-hot-toast";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const fetchPlaylists = async () => {
    try {
      setIsLoading(true);
      const response = await playlistAPI.getMyPlaylists();

      const playlistsData =
        response.data?.data?.docs ||
        response.data?.docs ||
        response.data?.data ||
        [];

      setPlaylists(playlistsData);
    } catch (error) {
      console.error("Playlists error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaylistCreated = () => {
    setShowCreateModal(false);
    fetchPlaylists();
  };

  const handlePlaylistUpdated = () => {
    setEditingPlaylist(null);
    fetchPlaylists();
  };

  const handleDeletePlaylist = async (playlistId) => {
    if (!window.confirm("Are you sure you want to delete this playlist?")) {
      return;
    }

    setDeletingId(playlistId);
    try {
      await playlistAPI.deletePlaylist(playlistId);
      toast.success("Playlist deleted successfully");
      fetchPlaylists();
    } catch (error) {
      console.error("Delete playlist error:", error);
      toast.error("Failed to delete playlist");
    } finally {
      setDeletingId(null);
      setOpenMenuId(null);
    }
  };

  const toggleMenu = (playlistId, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenMenuId(openMenuId === playlistId ? null : playlistId);
  };

  const handleEdit = (playlist, e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPlaylist(playlist);
    setOpenMenuId(null);
  };

  const handleDelete = (playlistId, e) => {
    e.preventDefault();
    e.stopPropagation();
    handleDeletePlaylist(playlistId);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    if (openMenuId) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [openMenuId]);

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
        <h1 className="text-3xl font-bold text-gray-900">My Playlists</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>New Playlist</span>
        </button>
      </div>

      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {playlists.map((playlist) => {
            const videoCount = playlist.videos?.length || 0;
            const isDeleting = deletingId === playlist._id;

            return (
              <div key={playlist._id} className="relative">
                <Link
                  to={`/playlist/${playlist._id}`}
                  className="card hover:shadow-lg transition-shadow block"
                >
                  <div className="flex items-start space-x-3">
                    <List className="w-12 h-12 text-primary-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 mb-1 pr-8">
                        {playlist.name}
                      </h3>
                      {playlist.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {playlist.description}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {videoCount} {videoCount === 1 ? "video" : "videos"}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Three Dots Menu */}
                <div className="absolute top-4 right-4">
                  <button
                    onClick={(e) => toggleMenu(playlist._id, e)}
                    disabled={isDeleting}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {/* Dropdown Menu */}
                  {openMenuId === playlist._id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button
                        onClick={(e) => handleEdit(playlist, e)}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => handleDelete(playlist._id, e)}
                        disabled={isDeleting}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <List className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No playlists yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary mt-4"
          >
            Create Your First Playlist
          </button>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <CreatePlaylistModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handlePlaylistCreated}
        />
      )}

      {/* Edit Modal */}
      {editingPlaylist && (
        <EditPlaylistModal
          playlist={editingPlaylist}
          onClose={() => setEditingPlaylist(null)}
          onSuccess={handlePlaylistUpdated}
        />
      )}
    </div>
  );
};

export default Playlists;

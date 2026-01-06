import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";

const VideoCard = ({ video }) => {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views;
  };

  return (
    <Link to={`/watch/${video._id}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
            {video.title}
          </h3>

          {/* Owner Info */}
          {video.owner && (
            <div className="flex items-center space-x-2 mb-2">
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm text-gray-600">
                {video.owner.username}
              </span>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{formatViews(video.views || 0)} views</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;

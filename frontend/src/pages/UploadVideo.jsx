import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { videoAPI } from "../api/video";
import { Upload, Loader } from "lucide-react";
import toast from "react-hot-toast";

const UploadVideo = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "video") {
      setVideoFile(files[0]);
    } else if (name === "thumbnail") {
      setThumbnail(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!videoFile || !thumbnail) {
      toast.error("Video and thumbnail are required");
      return;
    }

    setIsLoading(true);

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("duration", formData.duration);
    submitData.append("video", videoFile);
    submitData.append("thumbnail", thumbnail);

    try {
      await videoAPI.uploadVideo(submitData);
      toast.success("Video uploaded successfully!");
      navigate("/");
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="card">
        <div className="flex items-center space-x-3 mb-6">
          <Upload className="w-8 h-8 text-primary-600" />
          <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter video title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              placeholder="Enter video description"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (seconds) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter video duration in seconds"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Video File *
            </label>
            <input
              type="file"
              name="video"
              onChange={handleFileChange}
              accept="video/*"
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail *
            </label>
            <input
              type="file"
              name="thumbnail"
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="input-field"
              required
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin w-5 h-5 mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload Video"
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadVideo;

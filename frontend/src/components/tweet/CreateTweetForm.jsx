// src/components/tweet/CreateTweetForm.jsx
import { useState } from "react";
import { tweetAPI } from "../../api/tweet";
import { Loader, Send } from "lucide-react";
import toast from "react-hot-toast";

const CreateTweetForm = ({ onTweetCreated }) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error("Tweet cannot be empty");
      return;
    }

    if (content.length > 280) {
      toast.error("Tweet cannot exceed 280 characters");
      return;
    }

    try {
      setIsLoading(true);
      const response = await tweetAPI.createTweet(content);

      // Extract tweet from response
      const newTweet = response.data?.data || response.data;

      console.log("Created tweet:", newTweet);

      // Clear form
      setContent("");

      // Notify parent component
      if (onTweetCreated && newTweet) {
        onTweetCreated(newTweet);
      }

      toast.success("Tweet posted!");
    } catch (error) {
      console.error("Create tweet error:", error);
      toast.error(error.response?.data?.message || "Failed to post tweet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows="3"
          maxLength={280}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between mt-3">
          <span className="text-sm text-gray-500">{content.length}/280</span>

          <button
            type="submit"
            disabled={isLoading || !content.trim()}
            className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTweetForm;

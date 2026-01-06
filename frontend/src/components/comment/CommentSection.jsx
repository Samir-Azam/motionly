import { useState, useEffect, useCallback } from "react";
import { commentAPI } from "../../api/comment";
import { useAuthStore } from "../../store/authStore";
import {
  MessageSquare,
  Send,
  Trash2,
  Reply,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import toast from "react-hot-toast";

// ✅ Move CommentItem outside to prevent recreation
const CommentItem = ({
  comment,
  isReply,
  parentId,
  user,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  handleReplySubmit,
  handleDelete,
  fetchReplies,
  expandedReplies,
  replies,
  loadingReplies,
  isAuthenticated,
}) => (
  <div className={`flex space-x-3 ${isReply ? "ml-12 mt-3" : ""}`}>
    <img
      src={comment.owner?.avatar || "/default-avatar.png"}
      alt={comment.owner?.username}
      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
    />
    <div className="flex-1">
      <div className="bg-gray-50 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-gray-900">
              {comment.owner?.fullName || comment.owner?.username}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              {(() => {
                const date = new Date(comment.createdAt);
                const now = new Date();
                const diffMs = now - date;
                const diffMins = Math.floor(diffMs / 60000);
                const diffHours = Math.floor(diffMs / 3600000);
                const diffDays = Math.floor(diffMs / 86400000);

                if (diffMins < 1) return "Just now";
                if (diffMins < 60) return `${diffMins}m ago`;
                if (diffHours < 24) return `${diffHours}h ago`;
                if (diffDays < 7) return `${diffDays}d ago`;

                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year:
                    date.getFullYear() !== now.getFullYear()
                      ? "numeric"
                      : undefined,
                });
              })()}
            </span>
          </div>
          {user?._id === comment.owner?._id && (
            <button
              onClick={() => handleDelete(comment._id, parentId)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-gray-700 mt-1">{comment.content}</p>
      </div>

      {/* Reply Button */}
      {!isReply && isAuthenticated && (
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <button
            onClick={() =>
              setReplyingTo(replyingTo === comment._id ? null : comment._id)
            }
            className="text-gray-600 hover:text-primary-600 flex items-center space-x-1"
          >
            <Reply className="w-4 h-4" />
            <span>Reply</span>
          </button>

          {comment.replyCount > 0 && (
            <button
              onClick={() => fetchReplies(comment._id)}
              disabled={loadingReplies[comment._id]}
              className="text-gray-600 hover:text-primary-600 flex items-center space-x-1"
            >
              {expandedReplies.has(comment._id) ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
              <span>
                {loadingReplies[comment._id]
                  ? "Loading..."
                  : `${comment.replyCount} ${
                      comment.replyCount === 1 ? "reply" : "replies"
                    }`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Reply Input */}
      {replyingTo === comment._id && (
        <div className="mt-3 flex space-x-2">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt={user?.username}
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="flex-1">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleReplySubmit(comment._id);
                }
              }}
              placeholder={`Reply to ${comment.owner?.username}...`}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleReplySubmit(comment._id)}
                disabled={!replyContent.trim()}
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reply
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent("");
                }}
                className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {expandedReplies.has(comment._id) && replies[comment._id] && (
        <div className="mt-3 space-y-3">
          {replies[comment._id].map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              isReply={true}
              parentId={comment._id}
              user={user}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReplySubmit={handleReplySubmit}
              handleDelete={handleDelete}
              fetchReplies={fetchReplies}
              expandedReplies={expandedReplies}
              replies={replies}
              loadingReplies={loadingReplies}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);

const CommentSection = ({ videoId }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState("");
  const [expandedReplies, setExpandedReplies] = useState(new Set());
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});

  useEffect(() => {
    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getVideoComments(videoId);
      const commentsData = response.data?.data || response.data;
      setComments(commentsData || []);
    } catch (error) {
      console.error("Comments error:", error);
    }
  };

  const fetchReplies = useCallback(
    async (commentId) => {
      if (replies[commentId]) {
        toggleReplies(commentId);
        return;
      }

      setLoadingReplies((prev) => ({ ...prev, [commentId]: true }));
      try {
        const response = await commentAPI.getReplies(commentId);
        const repliesData = response.data?.data || response.data;

        setReplies((prev) => ({ ...prev, [commentId]: repliesData || [] }));
        setExpandedReplies((prev) => new Set([...prev, commentId]));
      } catch (error) {
        console.error("Replies error:", error);
        toast.error("Failed to load replies");
      } finally {
        setLoadingReplies((prev) => ({ ...prev, [commentId]: false }));
      }
    },
    [replies]
  );

  const toggleReplies = (commentId) => {
    setExpandedReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to comment");
      return;
    }

    setIsLoading(true);
    try {
      const response = await commentAPI.addVideoComment(videoId, newComment);
      const newCommentData = response.data?.data || response.data;

      setComments((prev) => [newCommentData, ...prev]);
      setNewComment("");
      toast.success("Comment added!");
    } catch (error) {
      console.error("Add comment error:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = useCallback(
    async (parentCommentId) => {
      if (!replyContent.trim()) {
        toast.error("Reply cannot be empty");
        return;
      }

      try {
        const response = await commentAPI.addVideoComment(
          videoId,
          replyContent,
          parentCommentId
        );
        const newReply = response.data?.data || response.data;

        setReplies((prev) => ({
          ...prev,
          [parentCommentId]: [newReply, ...(prev[parentCommentId] || [])],
        }));

        setComments((prev) =>
          prev.map((c) =>
            c._id === parentCommentId
              ? { ...c, replyCount: (c.replyCount || 0) + 1 }
              : c
          )
        );

        setExpandedReplies((prev) => new Set([...prev, parentCommentId]));
        setReplyContent("");
        setReplyingTo(null);
        toast.success("Reply added!");
      } catch (error) {
        console.error("Add reply error:", error);
        toast.error("Failed to add reply");
      }
    },
    [videoId, replyContent]
  );

  const handleDelete = useCallback(
    async (commentId, parentCommentId = null) => {
      if (!window.confirm("Delete this comment?")) return;

      try {
        await commentAPI.deleteComment(commentId);

        if (parentCommentId) {
          setReplies((prev) => ({
            ...prev,
            [parentCommentId]: prev[parentCommentId].filter(
              (r) => r._id !== commentId
            ),
          }));

          setComments((prev) =>
            prev.map((c) =>
              c._id === parentCommentId
                ? { ...c, replyCount: Math.max(0, (c.replyCount || 0) - 1) }
                : c
            )
          );
        } else {
          setComments((prev) => prev.filter((c) => c._id !== commentId));
        }

        toast.success("Comment deleted");
      } catch (error) {
        console.error("Delete comment error:", error);
        toast.error("Failed to delete comment");
      }
    },
    []
  );

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 flex items-center space-x-2">
        <MessageSquare className="w-5 h-5" />
        <span>{comments.length} Comments</span>
      </h3>

      {isAuthenticated && user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex space-x-3">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows="2"
              />
              <button
                type="submit"
                disabled={isLoading || !newComment.trim()}
                className="btn-primary mt-2 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                <span>{isLoading ? "Posting..." : "Comment"}</span>
              </button>
            </div>
          </div>
        </form>
      ) : (
        <p className="text-gray-500 text-center py-4 bg-gray-50 rounded-lg mb-6">
          Please login to add comments
        </p>
      )}

      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            isReply={false}
            parentId={null}
            user={user}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleReplySubmit={handleReplySubmit}
            handleDelete={handleDelete}
            fetchReplies={fetchReplies}
            expandedReplies={expandedReplies}
            replies={replies}
            loadingReplies={loadingReplies}
            isAuthenticated={isAuthenticated}
          />
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No comments yet. Be the first!
        </p>
      )}
    </div>
  );
};

export default CommentSection;

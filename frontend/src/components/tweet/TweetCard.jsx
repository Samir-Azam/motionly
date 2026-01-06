import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { useSubscriptionStore } from "../../store/subscriptionStore";
import {
  Heart,
  MessageCircle,
  Trash2,
  UserPlus,
  UserCheck,
} from "lucide-react";
import { tweetAPI } from "../../api/tweet";
import { subscriptionAPI } from "../../api/subscription";
import toast from "react-hot-toast";

const TweetCard = ({ tweet, onDelete, onUnfollow }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(tweet.likesCount || 0);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showUnfollowConfirm, setShowUnfollowConfirm] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { isSubscribed, toggleSubscription: toggleSubStore } =
    useSubscriptionStore();
  const navigate = useNavigate();

  const owner = tweet.owner || {};
  const ownerUsername = owner.username || "Unknown";
  const ownerFullName = owner.fullName || "Unknown User";
  const ownerAvatar = owner.avatar || "/default-avatar.png";
  const isOwner = user?._id === owner._id;

  // Check if subscribed using global store
  const subscribed = isSubscribed(owner._id);

  const handleSubscribe = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to subscribe");
      navigate("/login");
      return;
    }

    // If already subscribed, show confirmation
    if (subscribed) {
      setShowUnfollowConfirm(true);
      return;
    }

    // Subscribe directly if not subscribed
    try {
      setIsSubscribing(true);
      await subscriptionAPI.toggleSubscription(owner._id);
      toggleSubStore(owner._id);
      toast.success(`Subscribed to ${ownerFullName}`);
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error("Failed to subscribe");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnfollowConfirm = async (e) => {
    e.stopPropagation();

    try {
      setIsSubscribing(true);
      await subscriptionAPI.toggleSubscription(owner._id);
      toggleSubStore(owner._id);
      setShowUnfollowConfirm(false);
      toast.success(`Unfollowed ${ownerFullName}`);

      // Notify parent to remove tweet if in "Following" feed
      if (onUnfollow) {
        onUnfollow(owner._id);
      }
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error("Failed to unfollow");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnfollowCancel = (e) => {
    e.stopPropagation();
    setShowUnfollowConfirm(false);
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to like");
      return;
    }

    try {
      await tweetAPI.toggleTweetLike(tweet._id);
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Failed to like tweet");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this tweet?")) {
      return;
    }

    try {
      await tweetAPI.deleteTweet(tweet._id);
      toast.success("Tweet deleted");
      onDelete(tweet._id);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete tweet");
    }
  };

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex space-x-3">
        <img
          src={ownerAvatar}
          alt={ownerUsername}
          className="w-12 h-12 rounded-full object-cover cursor-pointer"
          onClick={() => navigate(`/channel/${ownerUsername}`)}
        />

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <h3
                  className="font-semibold hover:underline cursor-pointer"
                  onClick={() => navigate(`/channel/${ownerUsername}`)}
                >
                  {ownerFullName}
                </h3>
                <p className="text-sm text-gray-500">@{ownerUsername}</p>
              </div>

              {!isOwner && isAuthenticated && (
                <div className="relative">
                  {showUnfollowConfirm ? (
                    <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1.5 rounded-full">
                      <span className="text-sm text-gray-700">Unfollow?</span>
                      <button
                        onClick={handleUnfollowConfirm}
                        disabled={isSubscribing}
                        className="px-2 py-0.5 bg-red-600 text-white text-xs rounded hover:bg-red-700 disabled:opacity-50"
                      >
                        Yes
                      </button>
                      <button
                        onClick={handleUnfollowCancel}
                        className="px-2 py-0.5 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className={`
                        px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center space-x-1
                        ${
                          subscribed
                            ? "bg-gray-200 text-gray-700 hover:bg-red-100 hover:text-red-600"
                            : "bg-primary-600 text-white hover:bg-primary-700"
                        }
                        ${isSubscribing ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      {subscribed ? (
                        <>
                          <UserCheck className="w-4 h-4" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {isOwner && (
              <button
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <p className="mt-2 text-gray-800 whitespace-pre-wrap">
            {tweet.content}
          </p>

          <div className="flex items-center space-x-6 mt-3">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked ? "text-red-600" : "text-gray-500"
              } hover:text-red-600 transition-colors`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{likesCount}</span>
            </button>

            <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">0</span>
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            {new Date(tweet.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;

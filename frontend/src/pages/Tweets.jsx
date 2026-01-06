import { useState, useEffect } from "react";
import { tweetAPI } from "../api/tweet";
import { useAuthStore } from "../store/authStore";
import TweetCard from "../components/tweet/TweetCard";
import CreateTweetForm from "../components/tweet/CreateTweetForm";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { MessageSquare, Globe, User, Users } from "lucide-react";

const Tweets = () => {
  const [tweets, setTweets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    setTweets([]);
    setPage(1);
    setHasMore(true);
    fetchTweets(1);
  }, [activeTab]);

  useEffect(() => {
    if (page > 1) {
      fetchTweets(page);
    }
  }, [page]);

  const fetchTweets = async (currentPage) => {
    try {
      setIsLoading(true);
      let response;

      if (activeTab === "all") {
        response = await tweetAPI.getTweetFeed(currentPage);
      } else if (activeTab === "following") {
        response = await tweetAPI.getPersonalizedFeed(currentPage);
      } else {
        if (!user?.username) {
          console.error("User username not found:", user);
          setIsLoading(false);
          return;
        }
        response = await tweetAPI.getUserTweets(user.username, currentPage);
      }

      const newTweets = response.data?.data?.docs || [];
      const hasNextPage = response.data?.data?.hasNextPage || false;

      setHasMore(hasNextPage);

      setTweets((prev) => {
        const existingIds = new Set(prev.map((t) => t._id));
        const filtered = newTweets.filter((t) => !existingIds.has(t._id));
        return currentPage === 1 ? newTweets : [...prev, ...filtered];
      });
    } catch (error) {
      console.error("Tweets error:", error);
      setTweets([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTweetCreated = (newTweet) => {
    setTweets((prev) => {
      const exists = prev.some((t) => t._id === newTweet._id);
      if (exists) return prev;
      return [newTweet, ...prev];
    });
  };

  const handleTweetDeleted = (tweetId) => {
    setTweets((prev) => prev.filter((t) => t._id !== tweetId));
  };

  const handleUnfollow = (channelId) => {
    if (activeTab === "following") {
      // Remove ALL tweets from this channel
      setTweets((prev) => prev.filter((t) => t.owner?._id !== channelId));
    }
  };


  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <MessageSquare className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">Community</h1>
        </div>
      </div>

      {isAuthenticated && (
        <div className="mb-6">
          <CreateTweetForm onTweetCreated={handleTweetCreated} />
        </div>
      )}

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("all")}
            className={`
              pb-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeTab === "all"
                  ? "border-primary-600 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }
            `}
          >
            <div className="flex items-center space-x-2">
              <Globe className="w-5 h-5" />
              <span>All Tweets</span>
            </div>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab("following")}
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === "following"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Following</span>
              </div>
            </button>
          )}

          {isAuthenticated && (
            <button
              onClick={() => setActiveTab("my")}
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${
                  activeTab === "my"
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>My Tweets</span>
              </div>
            </button>
          )}
        </nav>
      </div>

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet._id}
            tweet={tweet}
            onDelete={handleTweetDeleted}
            onUnfollow={handleUnfollow}
          />
        ))}
      </div>

      {isLoading && page === 1 && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {tweets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">
            {activeTab === "my"
              ? "You haven't posted yet"
              : activeTab === "following"
              ? "No tweets from channels you follow"
              : "No tweets yet"}
          </p>
          <p className="text-gray-400 text-sm">
            {activeTab === "my"
              ? "Share your first thought with the community!"
              : activeTab === "following"
              ? "Follow some channels to see their tweets here"
              : isAuthenticated
              ? "Be the first to share something!"
              : "Login to create tweets"}
          </p>
        </div>
      )}

      {hasMore && !isLoading && tweets.length > 0 && (
        <div className="flex justify-center mt-8">
          <button onClick={() => setPage((p) => p + 1)} className="btn-primary">
            Load More
          </button>
        </div>
      )}

      {isLoading && page > 1 && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner size="sm" />
        </div>
      )}
    </div>
  );
};

export default Tweets;

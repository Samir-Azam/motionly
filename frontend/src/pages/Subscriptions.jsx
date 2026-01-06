import { useState, useEffect } from "react";
import { subscriptionAPI } from "../api/subscription";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Users, UserMinus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unsubscribingId, setUnsubscribingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionAPI.getUserSubscriptions();

      console.log("Subscriptions response:", response);

      const data = response.data?.data?.docs || response.data?.data || [];
      setSubscriptions(data);
    } catch (error) {
      console.error("Subscriptions error:", error);
      setSubscriptions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async (channelId, channelName) => {
    if (
      !window.confirm(
        `Are you sure you want to unsubscribe from ${channelName}?`
      )
    ) {
      return;
    }

    try {
      setUnsubscribingId(channelId);
      await subscriptionAPI.toggleSubscription(channelId);

      // Remove from local state
      setSubscriptions((prev) =>
        prev.filter((sub) => {
          const channel = sub.channel || sub;
          return channel._id !== channelId;
        })
      );

      toast.success(`Unsubscribed from ${channelName}`);
    } catch (error) {
      console.error("Unsubscribe error:", error);
      toast.error("Failed to unsubscribe");
    } finally {
      setUnsubscribingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600" />
          <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
        </div>
        <p className="text-gray-500">
          {subscriptions.length}{" "}
          {subscriptions.length === 1 ? "channel" : "channels"}
        </p>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg font-medium mb-2">
            No subscriptions yet
          </p>
          <p className="text-gray-400 text-sm">
            Start following channels to see them here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptions.map((sub) => {
            const channel = sub.channel || sub;
            const isUnsubscribing = unsubscribingId === channel._id;

            return (
              <div
                key={channel._id}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <img
                    src={channel.avatar || "/default-avatar.png"}
                    alt={channel.username}
                    className="w-24 h-24 rounded-full object-cover mb-4 cursor-pointer"
                    onClick={() => navigate(`/channel/${channel.username}`)}
                  />
                  <h3
                    className="font-semibold text-lg text-gray-900 cursor-pointer hover:text-primary-600"
                    onClick={() => navigate(`/channel/${channel.username}`)}
                  >
                    {channel.fullName || channel.username}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    @{channel.username}
                  </p>

                  {channel.subscribersCount !== undefined && (
                    <p className="text-gray-400 text-xs mb-4">
                      {channel.subscribersCount}{" "}
                      {channel.subscribersCount === 1
                        ? "subscriber"
                        : "subscribers"}
                    </p>
                  )}

                  {/* Unsubscribe Button */}
                  <button
                    onClick={() =>
                      handleUnsubscribe(
                        channel._id,
                        channel.fullName || channel.username
                      )
                    }
                    disabled={isUnsubscribing}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
                  >
                    {isUnsubscribing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        <span>Unsubscribing...</span>
                      </>
                    ) : (
                      <>
                        <UserMinus className="w-4 h-4" />
                        <span>Unsubscribe</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Subscriptions;

import { useState, useEffect, useCallback } from "react";
import { searchAPI } from "../api/search";
import VideoCard from "../components/video/VideoCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { Search as SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Debounce utility
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Debounced search query
  const debouncedQuery = useDebounce(query, 500);

  // Auto-search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults(null);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery) => {
    setIsLoading(true);
    try {
      const response = await searchAPI.search(searchQuery);
      const data = response.data?.data || response.data;
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults({ videos: [], users: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  const getTotalResults = () => {
    if (!results) return 0;
    return (results.videos?.length || 0) + (results.users?.length || 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for videos and channels..."
            className="input-field pl-12 pr-4 py-3 text-lg"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setResults(null);
              }}
              className="absolute right-24 top-3.5 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
          <button type="submit" className="btn-primary absolute right-2 top-2">
            Search
          </button>
        </div>
      </form>

      {isLoading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {results && !isLoading && (
        <>
          {/* Tabs */}
          <div className="flex space-x-4 border-b mb-6">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab === "all"
                  ? "border-b-2 border-primary-600 text-primary-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              All ({getTotalResults()})
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab === "videos"
                  ? "border-b-2 border-primary-600 text-primary-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Videos ({results.videos?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("channels")}
              className={`pb-2 px-4 whitespace-nowrap ${
                activeTab === "channels"
                  ? "border-b-2 border-primary-600 text-primary-600 font-medium"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Channels ({results.users?.length || 0})
            </button>
          </div>

          {/* Videos */}
          {(activeTab === "all" || activeTab === "videos") &&
            results.videos?.length > 0 && (
              <div className="mb-8">
                {activeTab === "all" && (
                  <h2 className="text-xl font-bold mb-4">Videos</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {results.videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                  ))}
                </div>
              </div>
            )}

          {/* Channels */}
          {(activeTab === "all" || activeTab === "channels") &&
            results.users?.length > 0 && (
              <div className="mb-8">
                {activeTab === "all" && (
                  <h2 className="text-xl font-bold mb-4">Channels</h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.users.map((user) => (
                    <Link
                      key={user._id}
                      to={`/channel/${user.username}`}
                      className="card flex items-center space-x-4 hover:shadow-lg transition-shadow"
                    >
                      <img
                        src={user.avatar || "/default-avatar.png"}
                        alt={user.username}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "/default-avatar.png";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {user.fullName}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          {/* No Results */}
          {getTotalResults() === 0 && (
            <div className="text-center py-12">
              <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                No results found for "{query}"
              </p>
              <p className="text-gray-400 text-sm">
                Try different keywords or check spelling
              </p>
            </div>
          )}
        </>
      )}

      {/* Initial State */}
      {!results && !isLoading && !query && (
        <div className="text-center py-12">
          <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            Search for videos and channels
          </p>
        </div>
      )}
    </div>
  );
};

export default Search;

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import {
  Video,
  LogOut,
  User,
  Upload,
  Home,
  Search,
  LayoutDashboard,
  List,
  Clock,
  MessageSquare,
  Users,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <Video className="w-8 h-8 text-primary-600 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-primary-600/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Motionly
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 font-medium"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/search"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 font-medium"
            >
              <Search className="w-5 h-5" />
              <span>Search</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/tweets"
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-300 font-medium"
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Community</span>
                </Link>

                <Link
                  to="/upload"
                  className="flex items-center space-x-2 px-5 py-2.5 ml-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-xl font-medium transform hover:scale-105"
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload</span>
                </Link>

                {/* Dropdown Menu */}
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-2 px-3 py-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-primary-200 group-hover:ring-primary-400 transition-all duration-300"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center text-white font-bold ring-2 ring-primary-200 group-hover:ring-primary-400 transition-all duration-300">
                        {user?.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium">{user?.username}</span>
                    <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                  </button>

                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 mx-2 rounded-lg"
                    >
                      <User className="w-4 h-4" />
                      <span className="font-medium">Profile</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 mx-2 rounded-lg"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Link
                      to="/playlists"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 mx-2 rounded-lg"
                    >
                      <List className="w-4 h-4" />
                      <span className="font-medium">Playlists</span>
                    </Link>
                    <Link
                      to="/history"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 mx-2 rounded-lg"
                    >
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">History</span>
                    </Link>
                    <Link
                      to="/subscriptions"
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 transition-all duration-200 mx-2 rounded-lg"
                    >
                      <Users className="w-4 h-4" />
                      <span className="font-medium">Subscriptions</span>
                    </Link>
                    <hr className="my-2 border-gray-200" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-all duration-200 mx-2 rounded-lg font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3 ml-2">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-gray-700 hover:text-primary-700 font-semibold hover:bg-gray-100 rounded-xl transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-xl font-semibold transform hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-300"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/search"
                onClick={closeMobileMenu}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/tweets"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Community</span>
                  </Link>
                  <Link
                    to="/upload"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-200 font-medium shadow-md"
                  >
                    <Upload className="w-5 h-5" />
                    <span>Upload</span>
                  </Link>

                  <div className="h-2"></div>

                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <User className="w-5 h-5" />
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    to="/playlists"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <List className="w-5 h-5" />
                    <span>Playlists</span>
                  </Link>
                  <Link
                    to="/history"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <Clock className="w-5 h-5" />
                    <span>History</span>
                  </Link>
                  <Link
                    to="/subscriptions"
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700 rounded-xl transition-all duration-200 font-medium"
                  >
                    <Users className="w-5 h-5" />
                    <span>Subscriptions</span>
                  </Link>

                  <div className="h-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 w-full font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="h-2"></div>
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-center text-gray-700 font-semibold border-2 border-primary-600 rounded-xl hover:bg-primary-50 transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={closeMobileMenu}
                    className="px-4 py-3 text-center bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all duration-300 font-semibold shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

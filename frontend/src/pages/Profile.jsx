import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { userAPI } from "../api/user";
import { User, Mail, Lock, Image, Loader, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, updateUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);

  const [accountData, setAccountData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    username: user?.username || "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleAccountChange = (e) => {
    setAccountData({ ...accountData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userAPI.updateAccountDetails(accountData);
      updateUser(response.data);
      toast.success("Account updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await userAPI.resetPassword(passwordData);
      toast.success("Password updated successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (error) {
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await userAPI.updateAvatar(formData);
      updateUser(response.data);
      toast.success("Avatar updated successfully!");
    } catch (error) {
      console.error("Avatar update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCoverImageUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const response = await userAPI.updateCoverImage(formData);
      updateUser(response.data);
      toast.success("Cover image updated successfully!");
    } catch (error) {
      console.error("Cover image update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await userAPI.deleteAccount();
        await logout();
        navigate("/");
        toast.success("Account deleted successfully");
      } catch (error) {
        console.error("Delete account error:", error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Profile Settings
      </h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b mb-6">
        <button
          onClick={() => setActiveTab("account")}
          className={`pb-2 px-4 ${
            activeTab === "account"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600"
          }`}
        >
          Account
        </button>
        <button
          onClick={() => setActiveTab("password")}
          className={`pb-2 px-4 ${
            activeTab === "password"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600"
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setActiveTab("media")}
          className={`pb-2 px-4 ${
            activeTab === "media"
              ? "border-b-2 border-primary-600 text-primary-600"
              : "text-gray-600"
          }`}
        >
          Media
        </button>
      </div>

      {/* Account Tab */}
      {activeTab === "account" && (
        <div className="card">
          <form onSubmit={handleAccountUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={accountData.fullName}
                onChange={handleAccountChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={accountData.email}
                onChange={handleAccountChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={accountData.username}
                onChange={handleAccountChange}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Updating..." : "Update Account"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t">
            <button
              onClick={handleDeleteAccount}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <div className="card">
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Password
              </label>
              <input
                type="password"
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input-field"
                required
              />
            </div>

            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === "media" && (
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Avatar</h3>
            <div className="flex items-center space-x-4">
              <img
                src={user?.avatar}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <input
                  type="file"
                  onChange={handleAvatarUpdate}
                  accept="image/jpeg,image/png,image/webp"
                  className="input-field"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Cover Image</h3>
            <div className="space-y-4">
              {user?.coverImage && (
                <img
                  src={user.coverImage}
                  alt="Cover"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                onChange={handleCoverImageUpdate}
                accept="image/jpeg,image/png,image/webp"
                className="input-field"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

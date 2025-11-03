import React, { useEffect, useState } from "react";
import API_URL from "../config";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Mail,
  Key,
  MapPin,
  ShoppingCart,
  Edit2,
  Save,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Settings state
  const [showSettings, setShowSettings] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    address: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/get-user-information`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        setFormData({
          email: data.email || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
          address: data.address || "",
        });
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching user data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!formData.email) {
      setMessage("Email is required");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/update-email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Email updated successfully!");
        setEditingField(null);
        fetchUserData();
      } else {
        setMessage(data.message || "Failed to update email");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating email");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage("All password fields are required");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage("New passwords do not match");
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/update-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Password updated successfully!");
        setEditingField(null);
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setMessage(data.message || "Failed to update password");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating password");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleUpdateAddress = async () => {
    if (!formData.address) {
      setMessage("Address is required");
      return;
    }

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {
      const response = await fetch(`${API_URL}/update-address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          id: userId,
        },
        body: JSON.stringify({ address: formData.address }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage("Address updated successfully!");
        setEditingField(null);
        fetchUserData();
      } else {
        setMessage(data.message || "Failed to update address");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error updating address");
    } finally {
      setTimeout(() => setMessage(""), 3000);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-yellow-400 text-xl">Loading profile...</p>
      </div>
    );

  if (error || !userData)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <p className="text-red-400 text-xl">{error || "User not found"}</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-yellow-400 mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
              message.includes("success")
                ? "bg-green-900/50 border border-green-700 text-green-200"
                : "bg-red-900/50 border border-red-700 text-red-200"
            }`}
          >
            {message.includes("success") ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                  <User size={48} className="text-gray-900" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1">{userData.username}</h2>
                <p className="text-gray-400 text-sm mb-4">{userData.role}</p>

                <div className="w-full space-y-3 mt-6">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Settings size={18} />
                    {showSettings ? "Hide Settings" : "Settings"}
                  </button>

                  <button
                    onClick={() => navigate("/cart")}
                    className="w-full bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    My Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Username */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <User size={24} className="text-yellow-400" />
                <h3 className="text-xl font-bold text-white">Username</h3>
              </div>
              <p className="text-gray-300 text-lg">{userData.username}</p>
            </div>

            {/* Email */}
            <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Mail size={24} className="text-yellow-400" />
                  <h3 className="text-xl font-bold text-white">Email</h3>
                </div>
                {editingField !== "email" && (
                  <button
                    onClick={() => setEditingField("email")}
                    className="text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                )}
              </div>

              {editingField === "email" ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter new email"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleUpdateEmail}
                      className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <Save size={18} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingField(null);
                        setFormData({ ...formData, email: userData.email });
                      }}
                      className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300">{userData.email}</p>
              )}
            </div>

            {/* Settings Section */}
            {showSettings && (
              <>
                {/* Password */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Key size={24} className="text-yellow-400" />
                      <h3 className="text-xl font-bold text-white">Password</h3>
                    </div>
                    {editingField !== "password" && (
                      <button
                        onClick={() => setEditingField("password")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>

                  {editingField === "password" ? (
                    <div className="space-y-3">
                      <input
                        type="password"
                        value={formData.currentPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, currentPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Current password"
                      />
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, newPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="New password"
                      />
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        placeholder="Confirm new password"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdatePassword}
                          className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingField(null);
                            setFormData({
                              ...formData,
                              currentPassword: "",
                              newPassword: "",
                              confirmPassword: "",
                            });
                          }}
                          className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400">••••••••</p>
                  )}
                </div>

                {/* Address */}
                <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin size={24} className="text-yellow-400" />
                      <h3 className="text-xl font-bold text-white">Address</h3>
                    </div>
                    {editingField !== "address" && (
                      <button
                        onClick={() => setEditingField("address")}
                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                    )}
                  </div>

                  {editingField === "address" ? (
                    <div className="space-y-3">
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        rows="3"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                        placeholder="Enter new address"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdateAddress}
                          className="flex-1 bg-yellow-400 text-gray-900 font-semibold py-2 px-4 rounded-lg hover:bg-yellow-300 transition-colors flex items-center justify-center gap-2"
                        >
                          <Save size={18} />
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingField(null);
                            setFormData({ ...formData, address: userData.address });
                          }}
                          className="flex-1 bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300">{userData.address}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


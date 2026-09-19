import { useState, useEffect } from "react";
import { FiUserPlus, FiUserCheck, FiLoader } from "react-icons/fi";
import useFetch from "../hooks/useFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const UsersList = () => {
  const { data, loading, error } = useFetch(`${API_BASE_URL}/api/users/all`);
  
  // Local state to manage live user list and follow statuses
  const [users, setUsers] = useState([]);
  
  // Track loading state for individual follow/unfollow buttons
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Sync state with API data on initial load
  useEffect(() => {
    if (data?.users) {
      setUsers(data.users);
    }
  }, [data]);

  // Handle Follow / Unfollow Toggle
  const handleToggleFollow = async (userId, currentStatus) => {
    setActionLoadingId(userId);

    // 1. Optimistic Update (UI instantly reflect karega)
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user._id === userId) {
          return {
            ...user,
            isFollowing: !currentStatus,
            followersCount: currentStatus
              ? user.followersCount - 1
              : user.followersCount + 1,
          };
        }
        return user;
      })
    );

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/follow/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Cookie/JWT token send karne ke liye
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to toggle follow");
      }
    } catch (err) {
      console.error("Follow error:", err);
      
      // 2. Rollback UI state if backend request fails
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user._id === userId) {
            return {
              ...user,
              isFollowing: currentStatus,
              followersCount: currentStatus
                ? user.followersCount + 1
                : user.followersCount - 1,
            };
          }
          return user;
        })
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 space-y-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 w-28 bg-slate-200 rounded"></div>
                <div className="h-3 w-20 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-9 w-24 bg-slate-200 rounded-xl"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-8 p-4 bg-rose-50 text-rose-600 rounded-xl text-center text-sm font-medium">
        Error loading users: {error}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 font-sans">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Discover People</h2>

      {users.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No other users found.</p>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white border border-slate-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:border-slate-200 transition-all"
            >
              {/* User Avatar & Details */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg uppercase shadow-md shadow-indigo-100">
                  {user.username?.charAt(0) || "U"}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 capitalize leading-tight">
                    {user.username}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {user.followersCount} {user.followersCount === 1 ? "follower" : "followers"}
                  </p>
                </div>
              </div>

              {/* Dynamic Follow/Unfollow Button */}
              <button
                onClick={() => handleToggleFollow(user._id, user.isFollowing)}
                disabled={actionLoadingId === user._id}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all active:scale-95 disabled:opacity-60 ${
                  user.isFollowing
                    ? "bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 border border-slate-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100"
                }`}
              >
                {actionLoadingId === user._id ? (
                  <FiLoader className="animate-spin text-sm" />
                ) : user.isFollowing ? (
                  <>
                    <FiUserCheck className="text-sm" /> Following
                  </>
                ) : (
                  <>
                    <FiUserPlus className="text-sm" /> Follow
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;
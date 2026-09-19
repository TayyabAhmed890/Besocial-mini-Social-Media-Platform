import { useState } from "react";
import { FiMail, FiCalendar, FiGrid, FiHeart, FiUsers, FiUserCheck, FiX } from "react-icons/fi";
import useFetch from "../hooks/useFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const ProfilePage = () => {
  const { data, loading, error } = useFetch(`${API_BASE_URL}/api/users/profile`);

  // Modal active states ('followers', 'following', or null)
  const [modalType, setModalType] = useState(null);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-2xl w-full"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-24 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-4 bg-rose-50 text-rose-600 rounded-2xl text-center font-medium text-sm border border-rose-100">
        Failed to load profile data: {error}
      </div>
    );
  }

  const { user, stats } = data || {};

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-sans tracking-tight">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        {/* Header / Avatar */}
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-md shadow-indigo-100 uppercase">
            {user?.username?.charAt(0) || "U"}
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
              {user?.username}
            </h1>
            <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 font-medium">
              <FiMail className="text-indigo-600" />
              {user?.email}
            </p>
            {user?.createdAt && (
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                <FiCalendar /> Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Total Created Posts */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center sm:items-start space-y-2">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-xl text-lg">
              <FiGrid />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {stats?.totalPosts || 0}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Posts
              </p>
            </div>
          </div>

          {/* Total Liked Posts */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center sm:items-start space-y-2">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl text-lg">
              <FiHeart />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {stats?.totalLikedPosts || 0}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Liked
              </p>
            </div>
          </div>

          {/* Followers Clickable Card */}
          <button
            onClick={() => setModalType("followers")}
            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center sm:items-start space-y-2 hover:bg-slate-100 transition-colors text-left group cursor-pointer"
          >
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl text-lg group-hover:scale-105 transition-transform">
              <FiUsers />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {user?.followers?.length || stats?.followersCount || 0}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Followers
              </p>
            </div>
          </button>

          {/* Following Clickable Card */}
          <button
            onClick={() => setModalType("following")}
            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center sm:items-start space-y-2 hover:bg-slate-100 transition-colors text-left group cursor-pointer"
          >
            <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl text-lg group-hover:scale-105 transition-transform">
              <FiUserCheck />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {user?.following?.length || stats?.followingCount || 0}
              </p>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Following
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* User List Modal */}
      {modalType && (
        <UserListModal
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
};

// ==========================================
// User List Modal Component
// ==========================================
const UserListModal = ({ type, onClose }) => {
  const isFollowers = type === "followers";
  const endpoint = isFollowers
    ? `${API_BASE_URL}/api/users/followers`
    : `${API_BASE_URL}/api/users/followings`;

  const { data, loading, error } = useFetch(endpoint);
  const userList = data?.users || data || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900 capitalize flex items-center gap-2">
            {isFollowers ? <FiUsers className="text-emerald-600" /> : <FiUserCheck className="text-sky-600" />}
            {isFollowers ? "Followers" : "Following"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 max-h-80 overflow-y-auto space-y-3">
          {loading && (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <p className="text-xs text-rose-500 text-center py-6 font-medium">
              Failed to load list: {error}
            </p>
          )}

          {!loading && !error && userList.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-8 font-medium">
              No {type} found.
            </p>
          )}

          {!loading &&
            !error &&
            userList.map((item) => {
              // Ensure user object is populated
              const u = item.user || item;
              return (
                <div
                  key={u._id || u.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase text-sm">
                      {u.username?.charAt(0) || "U"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 capitalize">
                        {u.username}
                      </p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
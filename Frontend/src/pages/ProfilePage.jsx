import { useState, useEffect } from "react";
import { FiMail, FiCalendar, FiGrid, FiUsers, FiUserCheck} from "react-icons/fi";
import useFetch from "../hooks/useFetch";
import UserListModal from "../components/UserDetails";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const ProfilePage = () => {
  const { data, loading, error } = useFetch(`${API_BASE_URL}/api/users/profile`);
  const [modalType, setModalType] = useState(null);

  // Local state for instant real-time updates
  const [profileData, setProfileData] = useState(null);

  // Sync state when API data resolves
  useEffect(() => {
    if (data) {
      setProfileData(data);
    }
  }, [data]);

  // Callback to update counts instantly when follow/unfollow happens inside modal
  const handleFollowChange = (isFollowing, targetUserId) => {
    setProfileData((prev) => {
      if (!prev) return prev;
      const currentFollowingCount = prev.user?.following?.length || prev.stats?.followingCount || 0;
      const updatedCount = isFollowing ? currentFollowingCount + 1 : Math.max(0, currentFollowingCount - 1);

      return {
        ...prev,
        user: {
          ...prev.user,
          following: isFollowing
            ? [...(prev.user?.following || []), targetUserId]
            : (prev.user?.following || []).filter((id) => id !== targetUserId),
        },
        stats: {
          ...prev.stats,
          followingCount: updatedCount,
        },
      };
    });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse space-y-6">
        <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-2xl"></div>
          ))}
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

  const { user, stats } = profileData || {};

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 font-sans tracking-tight">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        
        {/* Header / Avatar Section */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-md shadow-indigo-100 uppercase shrink-0">
            {user?.username?.charAt(0) || "U"}
          </div>

          <div className="space-y-1.5 flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize truncate">
              {user?.username}
            </h1>
            <p className="text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1.5 font-medium truncate">
              <FiMail className="text-indigo-600 shrink-0" />
              <span className="truncate">{user?.email}</span>
            </p>
            {user?.createdAt && (
              <p className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-0.5">
                <FiCalendar className="shrink-0" /> Joined{" "}
                {new Date(user.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Responsive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          
          {/* Posts */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3 min-w-0">
            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl text-xl shrink-0 flex items-center justify-center">
              <FiGrid />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none mb-1 truncate">
                {stats?.totalPosts || 0}
              </p>
              <p className="text-[11px] font-bold text-slate-600 tracking-wider truncate">
                Posts
              </p>
            </div>
          </div>

          {/* Liked */}
          

          {/* Followers Clickable */}
          <button
            onClick={() => setModalType("followers")}
            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3 hover:bg-slate-100/80 transition-all text-left group cursor-pointer active:scale-95 min-w-0"
          >
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl text-xl shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiUsers />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none mb-1 truncate">
                {user?.followers?.length || stats?.followersCount || 0}
              </p>
              <p className="text-[11px] font-bold text-slate-600 tracking-wider truncate">
                Followers
              </p>
            </div>
          </button>

          {/* Following Clickable */}
          <button
            onClick={() => setModalType("following")}
            className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-3 hover:bg-slate-100/80 transition-all text-left group cursor-pointer active:scale-95 min-w-0"
          >
            <div className="p-3 bg-sky-100 text-sky-600 rounded-xl text-xl shrink-0 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FiUserCheck />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-none mb-1 truncate">
                {user?.following?.length || stats?.followingCount || 0}
              </p>
              <p className="text-[11px] font-bold text-slate-600 tracking-wider truncate">
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
          onFollowChange={handleFollowChange}
        />
      )}
    </div>
  );
};

export default ProfilePage;
import useFetch from "../hooks/useFetch";
import {FiUsers, FiUserCheck, FiX } from "react-icons/fi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const UserListModal = ({ type, onClose}) => {

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
        <div className="p-4 max-h-80 overflow-y-auto space-y-2">
          {loading && (
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
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
              const u = item.user || item;
              return (
                <div
                  key={u._id || u.id}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold uppercase text-sm shrink-0">
                      {u.username?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 capitalize truncate">
                        {u.username}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{u.email}</p>
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

export default UserListModal
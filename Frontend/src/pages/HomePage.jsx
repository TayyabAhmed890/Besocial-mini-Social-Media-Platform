import { Link } from "react-router-dom";
import { FaRegNewspaper, FaPlusCircle } from "react-icons/fa";
import { BsCardList as CardIcon } from "react-icons/bs";
import useFetch from "../hooks/useFetch";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const HomePage = ({ user, isUserLoading }) => {
  // Check if post count is pre-populated in user prop
  const hasPrepopulatedCount = user?.postsCount !== undefined || user?.posts !== undefined;
  
  // Conditionally trigger fetch url
  const fetchUrl = user && !hasPrepopulatedCount ? `${API_BASE_URL}/api/posts/mypost` : null;

  const { data, loading: loadingCount } = useFetch(fetchUrl);

  // Derive final post count
  const postCount = hasPrepopulatedCount
    ? (user?.postsCount ?? user?.posts?.length ?? 0)
    : (data?.posts?.length ?? data?.count ?? 0);

  // 1. Natural Page Skeleton Loader
  if (isUserLoading) {
    return (
      <main className="min-h-[85vh] bg-slate-50 flex flex-col items-center justify-center py-10 px-4">
        <div className="max-w-3xl w-full text-center flex flex-col items-center gap-6 animate-pulse">
          
          {/* Greeting Skeleton */}
          <div className="h-5 w-36 bg-slate-200 rounded-md"></div>

          {/* Large Hero Title Skeleton */}
          <div className="flex flex-col items-center gap-3 w-full">
            <div className="h-10 sm:h-14 w-4/5 bg-slate-200 rounded-xl"></div>
            <div className="h-10 sm:h-14 w-3/5 bg-slate-200 rounded-xl"></div>
          </div>

          {/* Subtitle Description Skeleton */}
          <div className="h-4 w-64 sm:w-96 bg-slate-200 rounded-md"></div>

          {/* Action Buttons Skeleton */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <div className="h-12 w-40 bg-slate-200 rounded-xl"></div>
            <div className="h-12 w-40 bg-slate-200 rounded-xl"></div>
          </div>

          {/* Minimal Widget Skeleton */}
          <div className="mt-4 w-full max-w-xs p-4 rounded-2xl flex items-center justify-between border border-slate-200/60 bg-white/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="flex flex-col gap-1.5 text-left">
                <div className="h-3 w-16 bg-slate-200 rounded"></div>
                <div className="h-5 w-8 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-3 w-12 bg-slate-200 rounded"></div>
          </div>

        </div>
      </main>
    );
  }

  // 2. Main Page Layout
  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center py-10 px-4">
      <div className="max-w-3xl w-full text-center flex flex-col items-center gap-6">
        
        {/* User Greeting */}
        <p className="text-lg text-slate-600 font-medium">
          Welcome,{" "}
          <span className="text-indigo-600 font-bold capitalize">
            {user?.name || user?.username || "Guest"}
          </span>{" "}
          👋
        </p>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 leading-tight tracking-tight">
          Sharing Life Moments with{" "}
          <span className="text-indigo-600 block sm:inline">Besocial!</span>
        </h1>

        <p className="text-slate-500 max-w-md text-sm sm:text-base">
          Connect, explore, and share your everyday stories with the community.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mt-2">
          <Link
            to="/feed"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95"
          >
            <FaRegNewspaper /> Explore Feed
          </Link>

          <Link
            to="/create_post"
            className="flex items-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold px-6 py-3 rounded-xl border border-indigo-200 transition-all active:scale-95"
          >
            <FaPlusCircle /> Create Post
          </Link>
        </div>

        {/* Single Post Stat Widget */}
        {user && (
          <div className="mt-4 w-full max-w-xs bg-white border border-slate-200/80 p-4 rounded-2xl flex items-center justify-between shadow-sm">
            {loadingCount ? (
              <div className="flex items-center justify-between w-full animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
                  <div className="flex flex-col gap-1.5 text-left">
                    <div className="h-3 w-16 bg-slate-200 rounded"></div>
                    <div className="h-5 w-8 bg-slate-200 rounded"></div>
                  </div>
                </div>
                <div className="h-3 w-12 bg-slate-200 rounded"></div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-xl text-lg shadow-sm shadow-indigo-200">
                    <CardIcon />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-slate-500 font-medium">Your Posts</p>
                    <p className="text-lg font-extrabold text-slate-800">
                      {postCount}
                    </p>
                  </div>
                </div>

                <Link
                  to="/my_posts"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
                >
                  View All
                </Link>
              </>
            )}
          </div>
        )}

      </div>
    </main>
  );
};

export default HomePage;
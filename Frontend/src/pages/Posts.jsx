import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiX, FiLock, FiClock } from "react-icons/fi";
import useFetch from "../hooks/useFetch";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Posts = ({ user }) => {
  const navigate = useNavigate();
  const currentUserId = user?._id || user?.id;

  const { data: apiResponse, setData, loading, error } = useFetch(`${API_BASE_URL}/api/posts`);
  const posts = apiResponse?.posts || [];

  const [selectedPost, setSelectedPost] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [doubleTapAnimationId, setDoubleTapAnimationId] = useState(null);

  // Lock background scroll when modal open
  useEffect(() => {
    if (selectedPost || showLoginPrompt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedPost(null);
        setShowLoginPrompt(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedPost, showLoginPrompt]);

  // Relative Time Formatter
  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleLike = async (e, postId) => {
    if (e) e.stopPropagation();

    if (!currentUserId) {
      setShowLoginPrompt(true);
      return;
    }

    setDoubleTapAnimationId(postId);
    setTimeout(() => setDoubleTapAnimationId(null), 700);

    // Optimistic UI Update
    setData((prev) => {
      if (!prev?.posts) return prev;
      return {
        ...prev,
        posts: prev.posts.map((post) => {
          if (post._id !== postId) return post;

          const isLiked = post.likes?.some((id) => id.toString() === currentUserId.toString());
          const updatedLikes = isLiked
            ? post.likes.filter((id) => id.toString() !== currentUserId.toString())
            : [...(post.likes || []), currentUserId];

          const updatedPost = { ...post, likes: updatedLikes };

          if (selectedPost && selectedPost._id === postId) {
            setSelectedPost(updatedPost);
          }

          return updatedPost;
        }),
      };
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/like/${postId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to update like status");

      const result = await res.json();

      if (result?.updatedLikes) {
        setData((prev) => ({
          ...prev,
          posts: prev.posts.map((post) => {
            if (post._id === postId) {
              const freshPost = { ...post, likes: result.updatedLikes };
              if (selectedPost && selectedPost._id === postId) {
                setSelectedPost(freshPost);
              }
              return freshPost;
            }
            return post;
          }),
        }));
      }
    } catch (err) {
      console.error("Like Error:", err);
    }
  };

  const handleDoubleTap = (e, postId) => {
    e.stopPropagation();
    handleLike(null, postId);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div key={n} className="animate-pulse bg-slate-200/60 h-80 sm:h-96 rounded-2xl w-full"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto my-12 p-4 bg-rose-50 text-rose-600 rounded-2xl text-center font-medium text-sm border border-rose-100">
        Error loading posts: {error}
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto py-6 sm:py-8 px-3 sm:px-4 font-sans tracking-tight">
      {posts.length === 0 ? (
        <div className="text-center py-20 text-slate-400 font-medium text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          No posts found. Be the first to share something!
        </div>
      ) : (
        /* Main Cards Responsive Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {posts.map((post) => {
            const isLiked = currentUserId && post.likes?.some(
              (id) => id.toString() === currentUserId.toString()
            );

            return (
              <article
                key={post._id}
                onClick={() => setSelectedPost(post)}
                className="group relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                {/* Header: Indigo Solid Profile Symbol */}
                <div className="p-3 sm:p-3.5 flex items-center justify-between border-b border-slate-50">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                      {post.user?.username?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <span className="text-xs font-bold text-slate-800 capitalize truncate">
                      {post.user?.username || "Anonymous"}
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1 shrink-0">
                    <FiClock size={11} className="text-slate-300" />
                    {formatTimeAgo(post.createdAt)}
                  </span>
                </div>

                {/* Card Image Container + Classic Center White Heart Hover Overlay */}
                <div
                  onDoubleClick={(e) => handleDoubleTap(e, post._id)}
                  className="relative aspect-square w-full bg-slate-900 overflow-hidden select-none"
                >
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    src={post.image}
                    alt={post.caption || "Post content"}
                    loading="lazy"
                  />

                  {/* Double Tap Heart Pop */}
                  {doubleTapAnimationId === post._id && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                      <FaHeart className="text-white/90 text-6xl sm:text-7xl drop-shadow-xl animate-ping duration-300" />
                    </div>
                  )}

                  {/* Center Overlay: White Heart + Like Count */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white font-bold text-base sm:text-lg">
                    <div className="flex items-center gap-2 drop-shadow-md">
                      <FaHeart className="text-white text-2xl sm:text-3xl" />
                      <span>{post.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions & Caption Preview */}
                <div className="p-3 sm:p-3.5 flex items-center justify-between bg-white border-t border-slate-50/80">
                  <p className="text-xs text-slate-600 truncate max-w-[75%] font-medium">
                    {post.caption || "No caption provided"}
                  </p>

                  <button
                    onClick={(e) => handleLike(e, post._id)}
                    className="p-1 rounded-full text-slate-700 hover:text-rose-500 transition-transform active:scale-90"
                    aria-label="Like post"
                  >
                    {isLiked ? (
                      <FaHeart className="text-rose-500 text-lg animate-[bounce_0.25s_ease-in-out]" />
                    ) : (
                      <FiHeart className="text-lg text-slate-400 hover:text-rose-500 transition-colors" />
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Responsive Detail View Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] grid grid-cols-1 md:grid-cols-2 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Close Button Overlay */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-slate-900/60 text-white hover:bg-slate-900 transition-all backdrop-blur-sm"
              aria-label="Close modal"
            >
              <FiX className="text-base sm:text-lg" />
            </button>

            {/* Left Image Section */}
            <div
              onDoubleClick={(e) => handleDoubleTap(e, selectedPost._id)}
              className="bg-black flex items-center justify-center max-h-[40vh] sm:max-h-[50vh] md:max-h-[80vh] relative select-none"
            >
              <img
                src={selectedPost.image}
                alt={selectedPost.caption}
                className="w-full h-full object-contain max-h-[40vh] sm:max-h-[50vh] md:max-h-[80vh]"
              />
              {doubleTapAnimationId === selectedPost._id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <FaHeart className="text-white/90 text-7xl drop-shadow-xl animate-ping duration-300" />
                </div>
              )}
            </div>

            {/* Right Side Info Section */}
            <div className="p-4 sm:p-6 flex flex-col justify-between h-full bg-white overflow-y-auto">
              <div className="space-y-4">
                {/* Modal User Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                    {selectedPost.user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 capitalize">
                      {selectedPost.user?.username || "Anonymous"}
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <FiClock size={10} />
                      {formatTimeAgo(selectedPost.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Caption Text */}
                <p className="text-slate-700 text-xs sm:text-sm whitespace-pre-line leading-relaxed font-normal">
                  {selectedPost.caption || "No caption provided for this post."}
                </p>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-6">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={(e) => handleLike(e, selectedPost._id)}
                    className="p-1 text-slate-700 hover:text-rose-500 transition-transform active:scale-90"
                    aria-label="Like post"
                  >
                    {currentUserId &&
                    selectedPost.likes?.some(
                      (id) => id.toString() === currentUserId.toString()
                    ) ? (
                      <FaHeart className="text-rose-500 text-2xl animate-[bounce_0.25s_ease-in-out]" />
                    ) : (
                      <FiHeart className="text-2xl text-slate-400 hover:text-rose-500 transition-colors" />
                    )}
                  </button>
                  <span className="font-bold text-xs sm:text-sm text-slate-800">
                    {selectedPost.likes?.length || 0} {selectedPost.likes?.length === 1 ? "like" : "likes"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowLoginPrompt(false)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 max-w-sm w-full text-center shadow-2xl space-y-4 border border-slate-100 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto text-xl">
              <FiLock />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Login Required</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log in to like posts and engage with the community.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate("/login");
                }}
                className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-100 transition-colors"
              >
                Login Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Posts;
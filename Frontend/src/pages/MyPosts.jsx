import { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { FiTrash2, FiAlertTriangle, FiClock, FiMaximize2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import useDelete from "../hooks/useDelete";

// Base API URL from environment variables for security
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const Posts = () => {
  const navigate = useNavigate();

  // Selected Post tracking states
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedPostDetails, setSelectedPostDetails] = useState(null); // For detail view modal
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Fetching Posts securely using env variable
  const { data: apiResponse, setData, loading, error } = useFetch(
    `${API_BASE_URL}/api/posts/mypost`
  );

  // 2. Delete Operation
  const { deleteItem } = useDelete();

  // Extract posts safely
  const posts = apiResponse?.posts || [];

  // Authentication Check
  useEffect(() => {
    if (error) {
      navigate("/login");
    }
  }, [error, navigate]);

  // Open Delete Modal
  const openDeleteModal = (e, id) => {
    e.stopPropagation(); // Card click event stop karne ke liye
    setSelectedPostId(id);
  };

  // Close Delete Modal
  const closeDeleteModal = () => {
    if (!isDeleting) {
      setSelectedPostId(null);
    }
  };

  // Open Post View Modal
  const openPostDetails = (post) => {
    setSelectedPostDetails(post);
  };

  // Close Post View Modal
  const closePostDetails = () => {
    setSelectedPostDetails(null);
  };

  // Confirm Delete Action
  const handleConfirmDelete = async () => {
    if (!selectedPostId) return;

    setIsDeleting(true);
    try {
      const response = await deleteItem(`${API_BASE_URL}/api/posts/${selectedPostId}`);

      if (response?.success || response?.status === 200) {
        // UI se post remove kar do
        setData((prev) => ({
          ...prev,
          posts: (prev?.posts || []).filter((post) => post._id !== selectedPostId),
        }));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleting(false);
      setSelectedPostId(null);
    }
  };

  // Date Formatter Helper Function
  const formatDate = (dateString) => {
    if (!dateString) return "Recently added";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Skeleton Loader UI
  if (loading) {
    return (
      <section className="py-11 px-4 max-w-6xl mx-auto flex gap-6 items-center justify-center flex-wrap">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="w-full max-w-sm h-96 bg-gray-200 animate-pulse rounded-xl overflow-hidden shadow-md"
          >
            <div className="w-full h-80 bg-gray-300"></div>
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="py-11 px-4 max-w-6xl mx-auto flex gap-6 items-center justify-center flex-wrap relative">
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-indigo-50 p-6 rounded-full mb-4">
            <svg
              className="w-12 h-12 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 00-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">No Posts Found</h2>
          <p className="text-gray-500 mt-1">You haven't uploaded any posts yet.</p>
        </div>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            onClick={() => openPostDetails(post)}
            className="group shadow-md hover:shadow-xl transition-all duration-300 w-full max-w-sm overflow-hidden bg-white border border-gray-100 rounded-xl relative flex flex-col justify-between cursor-pointer"
          >
            {/* Post Image Container */}
            <div className="relative w-full h-80 bg-gray-100 overflow-hidden">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                src={post.image}
                alt="Post content"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-800 shadow">
                  <FiMaximize2 size={20} />
                </span>
              </div>
            </div>

            {/* Created At Timestamp & Delete Trigger */}
            <div className="p-4 flex justify-between items-center bg-white border-t border-gray-50">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                <FiClock className="text-indigo-500" size={14} />
                <span>Created at: {formatDate(post.createdAt)}</span>
              </div>

              {/* Delete Icon Button */}
              <button
                type="button"
                aria-label="Delete post"
                onClick={(e) => openDeleteModal(e, post._id)}
                className="text-gray-400 hover:text-red-600 transition-colors duration-200 p-1 rounded-full hover:bg-red-50"
              >
                <IoMdCloseCircle size={24} />
              </button>
            </div>
          </div>
        ))
      )}

      {/* FULL POST DETAIL MODAL */}
      {selectedPostDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden transform transition-all duration-300 flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative w-full bg-slate-900 max-h-96 flex items-center justify-center overflow-hidden">
              <img
                src={selectedPostDetails.image}
                alt="Post view"
                className="w-full max-h-96 object-contain"
              />
              <button
                onClick={closePostDetails}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full backdrop-blur-sm transition-colors"
              >
                <IoMdCloseCircle size={26} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Post Caption
                </span>
                <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                  {selectedPostDetails.caption || "No caption provided for this post."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                <span>Created at: {formatDate(selectedPostDetails.createdAt)}</span>
                <button
                  type="button"
                  onClick={closePostDetails}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION POPUP */}
      {selectedPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center transform transition-all duration-300 scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Alert Icon */}
            <div className="w-14 h-14 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle size={28} />
            </div>

            {/* Modal Heading & Text */}
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 justify-center">
              <button
                type="button"
                disabled={isDeleting}
                onClick={closeDeleteModal}
                className="w-full py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition-colors duration-200 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <FiTrash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Posts;
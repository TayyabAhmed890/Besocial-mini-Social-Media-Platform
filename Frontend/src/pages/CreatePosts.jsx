import Button from "../components/Button";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../Hooks/usePost";
import { HiOutlineCloudUpload, HiX, HiCheckCircle, HiExclamationCircle } from "react-icons/hi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const CreatePosts = () => {
  const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [caption, setCaption] = useState("");
  const fileInputRef = useRef(null);

  const { executePost, loading, serverError, successMessage, setServerError } =
    usePost(`${API_BASE_URL}/api/posts/create`);

  // Clean memory URL on unmount or image change
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle Image Selection & Preview
  const handleImageChange = (file) => {
    if (file && file.type.startsWith("image/")) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      setServerError("");
    } else if (file) {
      setServerError("Please upload a valid image file.");
    }
  };

  // Remove Selected Image
  const handleRemoveImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!image || !caption.trim()) {
      setServerError("Please provide both an image and a caption.");
      setTimeout(() => setServerError(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    const result = await executePost(formData);

    if (result) {
      setCaption("");
      handleRemoveImage();

      // Immediate redirect or short delay
      setTimeout(() => {
        navigate("/feed");
      }, 1000);
    }
  }

  return (
    <section className="min-h-[85vh] py-10 px-4 flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Create New Post</h1>
          <p className="text-sm text-slate-500">Share your favorite photos and stories</p>
        </div>

        {/* Status Alerts */}
        {successMessage && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm font-medium">
            <HiCheckCircle size={20} className="shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {serverError && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium">
            <HiExclamationCircle size={20} className="shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Image Upload / Preview */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Photo</label>
            
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
                <img
                  src={imagePreview}
                  alt="Selected Preview"
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-3 right-3 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition-colors cursor-pointer"
                  title="Remove Image"
                >
                  <HiX size={18} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-52 border-2 border-dashed border-slate-200 hover:border-indigo-500 bg-slate-50/50 hover:bg-indigo-50/20 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all group"
              >
                <div className="p-3 bg-white group-hover:bg-indigo-100 text-slate-400 group-hover:text-indigo-600 rounded-full border border-slate-200/60 shadow-xs transition-colors">
                  <HiOutlineCloudUpload size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-600">
                    Click to upload photo
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">PNG, JPG or WEBP</p>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0])}
            />
          </div>

          {/* Caption Input */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Caption</label>
            <textarea
              rows={3}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a clear caption for your post..."
              className="w-full p-3 text-sm rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all resize-none text-slate-800 placeholder:text-slate-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              name={loading ? "Publishing..." : "Publish Post"}
              bg="bg-indigo-600 hover:bg-indigo-700"
              text="text-white"
              className="w-full justify-center text-center py-2.5"
              disabled={loading}
            />
          </div>

        </form>
      </div>
    </section>
  );
};

export default CreatePosts;
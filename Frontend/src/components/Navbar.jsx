import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { TbLogout } from "react-icons/tb";
import { FiUser, FiAlertCircle, FiTrash2, FiChevronDown, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Button from "./Button";
import usePost from "../hooks/usePost";
import useDelete from "../hooks/useDelete"; // Custom Delete Hook Import

const Navbar = ({ isLoggedIn, setIsLoggedIn, user, setUser }) => {
  const navigate = useNavigate();

  // Environment Base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // UI State Modals & Dropdown
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Form & Error Local State
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const dropdownRef = useRef(null);

  // Custom Hooks Setup
  const { executePost: executeLogout, loading: logoutLoading } = usePost(
    `${API_BASE_URL}/api/auth/logout`
  );

  // Integrated useDelete hook
  const { deleteItem, isDeleting } = useDelete();

  // Close Dropdown Menu on Outside Click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smooth Modal Closing Handler
  const closeModal = (modalType) => {
    setIsExiting(true);
    setTimeout(() => {
      if (modalType === "logout") setShowLogoutModal(false);
      if (modalType === "delete") {
        setShowDeleteModal(false);
        setCurrentPassword("");
        setDeleteError("");
      }
      setIsExiting(false);
    }, 150);
  };

  const openLogoutModal = () => {
    setShowDropdown(false);
    setIsExiting(false);
    setShowLogoutModal(true);
  };

  const openDeleteModal = () => {
    setShowDropdown(false);
    setIsExiting(false);
    setShowDeleteModal(true);
  };

  // 1. Logout Handler
  const confirmLogout = async () => {
    try {
      const res = await executeLogout();
      if (res) {
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem("isLoggedIn");
        closeModal("logout");
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout Error:", err);
    }
  };

  // 2. Delete Profile Handler using `useDelete` Hook
  const confirmDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");

    if (!currentPassword) {
      setDeleteError("Password is required to confirm account deletion.");
      return;
    }

    // Call custom hook function passing URL and body payload
    const response = await deleteItem(`${API_BASE_URL}/api/users/delete_user`, {
      currentPassword,
    });

    if (response.success) {
      // Success State Cleanup
      setIsLoggedIn(false);
      setUser(null);
      localStorage.removeItem("isLoggedIn");
      closeModal("delete");
      navigate("/login");
    } else {
      // Error handling from hook return value
      setDeleteError(response.error || "Failed to delete account. Please try again.");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 w-full h-16 px-4 md:px-8 flex justify-between items-center shadow-xs">
        {/* Brand & Sidebar */}
        <div className="flex items-center gap-3">
          <Sidebar
            isLoggedIn={isLoggedIn}
            user={user}
            openLogoutModal={openLogoutModal}
            openDeleteModal={openDeleteModal}
          />
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Besocial
          </Link>
        </div>

        {/* User Dropdown */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <div className="hidden md:flex items-center gap-2">
              <Button
                func={() => navigate("/login")}
                name="Login"
                bg="bg-indigo-50 hover:bg-indigo-100"
                text="text-indigo-600"
              />
              <Button
                func={() => navigate("/register")}
                name="Register"
                bg="bg-indigo-600 hover:bg-indigo-700"
                text="text-white"
              />
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full p-1.5 md:pl-3 md:pr-2.5 transition-all cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.name ? user.name.charAt(0).toUpperCase() : <FiUser size={14} />}
                </div>

                <span className="hidden md:block text-sm font-semibold text-slate-800 capitalize max-w-30 truncate">
                  {user?.name || user?.username || "User"}
                </span>

                <FiChevronDown
                  size={16}
                  className={`text-slate-500 transition-transform duration-200 ${
                    showDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Signed in as
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user?.name || user?.username || "User"}
                    </p>
                    {user?.email && (
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    )}
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={openDeleteModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <FiTrash2 size={16} />
                      <span>Delete Profile</span>
                    </button>

                    <button
                      onClick={openLogoutModal}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                    >
                      <TbLogout size={16} />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          onClick={() => closeModal("logout")}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 transition-opacity duration-150 ${
            isExiting ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 transform transition-all duration-150 ${
              isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                <FiAlertCircle size={26} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Logout</h3>
              <p className="text-sm text-slate-500 mb-6">
                Are you sure you want to log out? You will need to sign in again to access your account.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  disabled={logoutLoading}
                  onClick={() => closeModal("logout")}
                  className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  disabled={logoutLoading}
                  onClick={confirmLogout}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center"
                >
                  {logoutLoading ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Logout"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Profile Modal (Using isDeleting from useDelete Hook) */}
      {showDeleteModal && (
        <div
          onClick={() => closeModal("delete")}
          className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 transition-opacity duration-150 ${
            isExiting ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 transform transition-all duration-150 ${
              isExiting ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4 ring-8 ring-red-50">
                <FiTrash2 size={24} />
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">Delete Profile?</h3>
              <p className="text-xs text-slate-500 mb-4">
                This action is permanent and cannot be undone. All your posts and account data will be erased.
              </p>

              <form onSubmit={confirmDeleteAccount} className="w-full text-left space-y-4">
                {deleteError && (
                  <div className="p-2.5 text-xs text-red-700 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                    <FiAlertCircle className="shrink-0" size={16} />
                    <span>{deleteError}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Enter Password to Confirm
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <FiLock size={16} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        if (deleteError) setDeleteError("");
                      }}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <FiEye size={16} /> : <FiEyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => closeModal("delete")}
                    className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isDeleting}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      "Delete Forever"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
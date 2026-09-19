import { GoSidebarCollapse, GoSidebarExpand } from "react-icons/go";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FiTrash2 } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import Button from "./Button";

const Sidebar = ({ isLoggedIn, user, openLogoutModal, openDeleteModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setIsOpen] = useState(false);

  function handleToggle() {
    setIsOpen(!open);
  }

  // Page Route change hone par auto close
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Sidebar open hone par Background scroll disable karna
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open]);

  const handleNavigateRegister = () => navigate("/register");
  const handleNavigateLogin = () => navigate("/login");

  const navLinks = [
    { name: "Feed", path: "/feed" },
    ...(isLoggedIn
      ? [
          { name: "Create Post", path: "/create_post" },
          { name: "My Posts", path: "/my_posts" },
          { name: "Profile", path: "/profile" },
          { name: "Connect", path: "/users" },
        ]
      : []),
  ];

  return (
    <>
      {/* Sidebar Toggle Button (When Closed) */}
      {!open && (
        <button
          onClick={handleToggle}
          className="p-1 text-slate-700 hover:text-indigo-600 transition-colors focus:outline-none cursor-pointer"
          aria-label="Open Sidebar"
        >
          <GoSidebarCollapse size={24} />
        </button>
      )}

      {/* Backdrop Overlay */}
      {open && (
        <div
          onClick={handleToggle}
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        />
      )}

      {/* Main Drawer Container */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl flex flex-col justify-between border-r border-slate-200 transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex justify-between border-b border-slate-100 p-4 items-center">
            <h1 className="text-2xl font-black text-indigo-600 tracking-tight">
              <Link to={"/"}>Besocial</Link>
            </h1>
            <button
              onClick={handleToggle}
              className="text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <GoSidebarExpand size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 p-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Mobile Bottom User Actions Bar */}
        <div className="flex md:hidden flex-col gap-3 p-4 border-t border-slate-100 bg-slate-50">
          {!isLoggedIn ? (
            <>
              <Button
                func={handleNavigateLogin}
                name="Login"
                bg="bg-indigo-50 hover:bg-indigo-100"
                text="text-indigo-600"
                className="w-full text-center justify-center"
              />
              <Button
                func={handleNavigateRegister}
                name="Register"
                bg="bg-indigo-600 hover:bg-indigo-700"
                text="text-white"
                className="w-full text-center justify-center"
              />
            </>
          ) : (
            <div className="flex flex-col gap-2">
              {/* User Profile Title */}
              <div className="px-1">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  Signed in as
                </p>
                <p className="text-sm font-bold text-slate-800 truncate capitalize">
                  {user?.name || user?.username || "User"}
                </p>
              </div>

              {/* Action Buttons Stack */}
              <div className="flex gap-2 pt-1">
                {/* Delete Account Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openDeleteModal();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-semibold hover:bg-red-100 active:scale-95 transition-all cursor-pointer"
                  title="Delete Profile"
                >
                  <FiTrash2 size={14} />
                  <span>Delete</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    openLogoutModal();
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-300 active:scale-95 transition-all cursor-pointer"
                  title="Logout"
                >
                  <TbLogout size={14} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
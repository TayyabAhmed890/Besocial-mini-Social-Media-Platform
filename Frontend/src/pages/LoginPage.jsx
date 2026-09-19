import { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FiLock, FiUser, FiMail, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import usePost from "../Hooks/usePost";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const LoginPage = ({ setUser, setIsLoggedIn, checkAuth }) => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Hook Initialization
  const { executePost, loading, serverError, successMessage } = usePost(
    `${API_BASE_URL}/api/auth/login`
  );

  // Dynamic Input Detection (Email or Username)
  const isEmailInput = identifier.includes("@");

  const handleIdentifierChange = (e) => {
    setIdentifier(e.target.value);
    if (identifierError) setIdentifierError("");
    if (clientMessage) setClientMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (passwordError) setPasswordError("");
    if (clientMessage) setClientMessage("");
  };

  function validate() {
    let isValid = true;

    if (!identifier.trim() || !password) {
      setClientMessage("Please fill in all fields");
      isValid = false;
    }

    // Identifier Validation
    if (!identifier.trim()) {
      setIdentifierError("Username or Email is required");
      isValid = false;
    } else if (isEmailInput && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(identifier.trim())) {
      setIdentifierError("Please enter a valid email address");
      isValid = false;
    }

    // Password Validation
    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setIdentifierError("");
    setPasswordError("");
    setClientMessage("");

    let isValid = validate();
    if (!isValid) return;

    // Trigger Post Request
    const result = await executePost({ identifier, password });

    if (result) {
      // Direct User State Update for instant Home UI rendering
      if (result.user && setUser) {
        setUser(result.user);
      }

      if (checkAuth) await checkAuth();
      localStorage.setItem("isLoggedIn", "true");
      if (setIsLoggedIn) setIsLoggedIn(true);

      setIdentifier("");
      setPassword("");

      setTimeout(() => {
        navigate("/");
      }, 800);
    }
  }

  return (
    <section className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4">
      
      {/* Header outside the Card */}
      <div className="text-center space-y-2 mb-6 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Login to <span className="text-indigo-600">Besocial</span>
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Enter your details below to log into your account
        </p>
      </div>

      {/* Form Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6">

        {/* Feedback Alerts */}
        {(serverError || clientMessage) && (
          <div className="flex items-center gap-2.5 p-3 text-xs sm:text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
            <FiAlertCircle className="shrink-0 text-base" />
            <span>{serverError || clientMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2.5 p-3 text-xs sm:text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
            <FiCheckCircle className="shrink-0 text-base" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username/Email Input with Dynamic Icon */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Username or Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 transition-all">
                {isEmailInput ? <FiMail size={17} /> : <FiUser size={17} />}
              </span>
              <input
                value={identifier}
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                  identifierError
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-600"
                } rounded-xl text-sm outline-none focus:ring-4 transition-all`}
                type="text"
                placeholder="Enter username or email"
                onChange={handleIdentifierChange}
              />
            </div>
            {identifierError && (
              <p className="text-red-500 text-xs font-medium pl-1">{identifierError}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Password
              </label>
            </div>

            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock size={17} />
              </span>
              <input
                value={password}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                  passwordError
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-600"
                } rounded-xl text-sm outline-none focus:ring-4 transition-all`}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                onChange={handlePasswordChange}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEye size={16} /> : <IoEyeOff size={16} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-xs font-medium pl-1">{passwordError}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              name={loading ? "Authenticating..." : "Login to Account"}
              bg="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
              text="text-white"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 active:scale-98 transition-all cursor-pointer"
            />
          </div>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-slate-600 pt-2">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
          >
            Register now
          </Link>
        </p>

      </div>
    </section>
  );
};

export default LoginPage;
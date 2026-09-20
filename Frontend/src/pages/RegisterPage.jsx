import { useState } from "react";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { FiLock, FiUser, FiMail, FiAlertCircle, FiCheckCircle, FiCheck, FiX } from "react-icons/fi";
import usePost from "../hooks/usePost";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const RegisterPage = ({ setUser, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [EmailErrors, setEmailErrors] = useState("");
  const [UserNameErrors, setUserNameErrors] = useState("");
  const [PasswordErrors, setPasswordErrors] = useState("");
  const [ConfirmPasswordErrors, setConfirmPasswordErrors] = useState("");
  const [clientMessage, setClientMessage] = useState("");

  const { executePost, loading, serverError, successMessage } = usePost(
    `${API_BASE_URL}/api/auth/register`
  );

  // Live Password Requirements Checklist
  const passwordCriteria = {
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (UserNameErrors) setUserNameErrors("");
    if (clientMessage) setClientMessage("");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (EmailErrors) setEmailErrors("");
    if (clientMessage) setClientMessage("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (PasswordErrors) setPasswordErrors("");
    if (clientMessage) setClientMessage("");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (ConfirmPasswordErrors) setConfirmPasswordErrors("");
    if (clientMessage) setClientMessage("");
  };

  function validate() {
    let isValid = true;

    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
      setClientMessage("All fields are required");
      isValid = false;
    }

    // Username Validation
    if (!username.trim()) {
      setUserNameErrors("Username is required");
      isValid = false;
    }

    // Email Validations
    if (!email.trim()) {
      setEmailErrors("Email is required");
      isValid = false;
    } else if (!/^[a-z]/.test(email)) {
      setEmailErrors("First letter must be lowercase (a-z)");
      isValid = false;
    } else if (!email.endsWith("@gmail.com")) {
      setEmailErrors("Email must end with @gmail.com");
      isValid = false;
    } else if (!/^[a-z][a-zA-Z0-9._%+-]*@gmail\.com$/.test(email)) {
      setEmailErrors("Invalid Gmail format");
      isValid = false;
    }

    // Password Criteria Validation
    if (!password) {
      setPasswordErrors("Password is required");
      isValid = false;
    } else if (!Object.values(passwordCriteria).every(Boolean)) {
      setPasswordErrors("Please fulfill all password requirements below");
      isValid = false;
    }

    // Confirm Password Match Check
    if (!confirmPassword) {
      setConfirmPasswordErrors("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordErrors("Passwords do not match");
      isValid = false;
    }

    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setEmailErrors("");
    setUserNameErrors("");
    setPasswordErrors("");
    setConfirmPasswordErrors("");
    setClientMessage("");

    let isValid = validate();
    if (!isValid) return;

    // Backend par confirmPassword bhejney ki zaroorat nahi hoti
    const result = await executePost({ username, email, password });

    if (result) {
      if (result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
      }

      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  }

  return (
    <section className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-2 mb-6 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Create Account on <span className="text-indigo-600">Besocial</span>
        </h1>
        <p className="text-sm text-slate-500 font-normal">
          Join our platform by filling out your details below
        </p>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6">

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

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Username
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiUser size={17} />
              </span>
              <input
                value={username}
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                  UserNameErrors
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-600"
                } rounded-xl text-sm outline-none focus:ring-4 transition-all`}
                type="text"
                placeholder="Choose a username"
                onChange={handleUsernameChange}
              />
            </div>
            {UserNameErrors && (
              <p className="text-red-500 text-xs font-medium pl-1">{UserNameErrors}</p>
            )}
          </div>

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiMail size={17} />
              </span>
              <input
                value={email}
                className={`w-full pl-10 pr-3 py-2.5 bg-slate-50 border ${
                  EmailErrors
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-600"
                } rounded-xl text-sm outline-none focus:ring-4 transition-all`}
                type="email"
                placeholder="john@gmail.com"
                onChange={handleEmailChange}
              />
            </div>
            {EmailErrors && (
              <p className="text-red-500 text-xs font-medium pl-1">{EmailErrors}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock size={17} />
              </span>
              <input
                value={password}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                  PasswordErrors
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
              >
                {showPassword ? <FaEye size={16} /> : <IoEyeOff size={16} />}
              </button>
            </div>
            {PasswordErrors && (
              <p className="text-red-500 text-xs font-medium pl-1">{PasswordErrors}</p>
            )}

            {/* Live Password Checklist Bar */}
            {password.length > 0 && (
              <div className="p-3 mt-2 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 transition-all">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.length ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                    {passwordCriteria.length ? <FiCheck size={14} /> : <FiX size={14} />} Min 6 Characters
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.uppercase ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                    {passwordCriteria.uppercase ? <FiCheck size={14} /> : <FiX size={14} />} 1 Uppercase (A-Z)
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.number ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                    {passwordCriteria.number ? <FiCheck size={14} /> : <FiX size={14} />} 1 Number (0-9)
                  </div>
                  <div className={`flex items-center gap-1.5 ${passwordCriteria.special ? "text-emerald-600 font-medium" : "text-slate-400"}`}>
                    {passwordCriteria.special ? <FiCheck size={14} /> : <FiX size={14} />} 1 Special Char (!@#$)
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Confirm Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <FiLock size={17} />
              </span>
              <input
                value={confirmPassword}
                className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border ${
                  ConfirmPasswordErrors
                    ? "border-red-500 focus:ring-red-200"
                    : "border-slate-200 focus:ring-indigo-200 focus:border-indigo-600"
                } rounded-xl text-sm outline-none focus:ring-4 transition-all`}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter password"
                onChange={handleConfirmPasswordChange}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye size={16} /> : <IoEyeOff size={16} />}
              </button>
            </div>
            {ConfirmPasswordErrors && (
              <p className="text-red-500 text-xs font-medium pl-1">{ConfirmPasswordErrors}</p>
            )}

            {/* Live Password Match Status */}
            {confirmPassword.length > 0 && (
              <p className={`text-xs font-medium pl-1 flex items-center gap-1 pt-1 ${password === confirmPassword ? "text-emerald-600" : "text-red-500"}`}>
                {password === confirmPassword ? "✓ Passwords match" : "✕ Passwords do not match"}
              </p>
            )}
          </div>

          <div className="pt-2">
            <Button
              name={loading ? "Registering..." : "Create Account"}
              bg="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
              text="text-white"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm shadow-md shadow-indigo-200 active:scale-98 transition-all cursor-pointer"
            />
          </div>
        </form>

        <p className="text-center text-sm text-slate-600 pt-2">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
          >
            Login
          </Link>
        </p>

      </div>
    </section>
  );
};

export default RegisterPage;
import { useState } from "react"
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

const LoginPage = ({setIsLoggedIn,checkAuth,setUser}) => {

  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [identifierError, setIdentifierError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false)

  const sendData = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          identifier,
          password,
        }),
      })
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.message); // ❌ error show
        setSuccessMessage(""); // clear success
        return false;
      }

      await checkAuth();

      setSuccessMessage(result.message || "Login successful");
      setServerError(""); // clear error
      localStorage.setItem("isLoggedIn", "true");
      
      return true; // ✅ success

    } catch (error) {
      console.error(`Error: ${error}`)
      setSuccessMessage("");
      setServerError("Network error");
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // reset errors
    setIdentifierError("");
    setPasswordError("");
    setServerError("");
    setSuccessMessage("");

    let isValid = true;

    if (!identifier.trim()) {
      setIdentifierError("Field is required");
      setTimeout(() => {
        setIdentifierError("");
      }, 3000);
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      setTimeout(() => {
        setPasswordError("")
      }, 3000);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Minimum 6 characters");
      isValid = false;
    }

    if (!isValid) return;

    const success = await sendData();

    if (!success) return; // ❌ error → stop

    // ✅ success
    setIdentifier("");
    setPassword("");
    setIsLoggedIn(true)

    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <>
      <section className="p-3 flex items-center justify-center flex-col gap-4 w-full h-screen">
        <h1 className="text-3xl font-bold text-indigo-600">Login</h1>
        <form onSubmit={(e) => {
          handleSubmit(e)
        }} className="gap-1 p-2 flex flex-col justify-center w-full max-w-75 mx-auto rounded-xl border">
          <div className=" p-2 flex flex-col gap-2">
            <label>
              Username or Email
            </label>
            <input value={identifier} className="p-2 border rounded-sm outline-none" type="text" placeholder="Enter Your Username or Email" onChange={(e) => setIdentifier(e.target.value)} />
            {identifierError && (
              <p className="text-red-500 text-sm">{identifierError}</p>
            )}
          </div>

          <div className=" p-2 flex flex-col gap-2">
            <label>
              Password
            </label>
            <div className="flex justify-between items-center border rounded-sm gap-2 pr-2">
            <input value={password} className="p-2 w-full outline-none" type={showPassword ? 'text' : 'password'} placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} />
            <button
            className="active:text-indigo-500"
              type="button"
              onClick={() => setShowPassword(!showPassword)}>
              {
                showPassword ? <FaEye /> : <IoEyeOff />
              }
            </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}
          </div>
          <div className="p-2 ">
            {serverError && (
              <p className="text-red-600 text-sm text-center">
                {serverError}
              </p>
            )}

            {successMessage && (
              <p className="text-green-600 text-sm text-center">
                {successMessage}
              </p>
            )}
            <Button name="Login" bg="bg-indigo-600"/>
          </div>
        </form>
        <h1>Need to Create an Account <span className="underline text-indigo-600"><Link to='/register'>Register</Link></span></h1>
      </section>
    </>
  )
}

export default LoginPage
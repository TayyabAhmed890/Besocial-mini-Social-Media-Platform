import { useState } from "react"
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";

const RegisterPage = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);


    const [EmailErrors, setEmailErros] = useState("");
    const [UserNameErrors, setUserNameErrors] = useState("");
    const [PasswordErrors, setPasswordErrors] = useState("");
    const [ServerErrors, setServerErrors] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [clientMessage, setClientMessage] = useState("");

    const sendData = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            })
            const result = await res.json();
            if (!res.ok) {
                setServerErrors(result.message);
                setSuccessMessage("")
                return false;
            }

            setSuccessMessage(result.message || "Registered successful");
            setServerErrors(""); // clear error

            return true; // ✅ success

        } catch (error) {
            console.error(`Error: ${error}`)
            setSuccessMessage("")
            setServerErrors("Network Error")
            return false
        }
    }

    function validate() {
        let isValid = true;

        if (!username.trim() || !email.trim() || !password.trim()) {

            setClientMessage("All fields are required")
            isValid = false;
        }

        if (!username.trim()) {
            setUserNameErrors("Username is Required!")
            setTimeout(() => {
                setUserNameErrors("")
            }, 3000);
            isValid = false;
        }

        if (!email.trim()) {
            setEmailErros("Email is Required!")
            setTimeout(() => {
                setEmailErros("")
            }, 3000);
            isValid = false;
        } else if (!email.includes("@")) {
            setEmailErrors("Invalid email");
            isValid = false;
        }

        if (!password.trim()) {
            setPasswordErrors("Password is Required!")
            setTimeout(() => {
                setPasswordErrors("")
            }, 3000);
            isValid = false;
        } else if (password.length < 6) {
            setPasswordErrors("Minimum 6 characters");
            isValid = false;
        }

        return isValid;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setEmailErros("");
        setUserNameErrors("");
        setPasswordErrors("");
        setServerErrors("");
        setSuccessMessage("");
        setClientMessage("");

        let isValid = validate();

        if (!isValid) return;

        let success = await sendData();
        if (!success) return;

        console.log("Form Submit")
        setEmail("");
        setPassword("");
        setUsername("");
        setTimeout(() => {
            navigate("/login");
        }, 2000);
    }

    return (
        <>
            <section className="p-3 flex items-center justify-center flex-col gap-4 w-full h-screen">
                <h1 className="text-3xl font-bold text-indigo-600">Register</h1>
                <form onSubmit={(e) => {
                    handleSubmit(e)
                }} className="gap-1 p-2 flex flex-col justify-center w-full max-w-75 mx-auto rounded-xl border">
                    <div className=" p-2 flex flex-col gap-2">
                        <label>
                            Username
                        </label>
                        <input value={username} className="p-2 border rounded-sm outline-none" type="text" placeholder="Enter Your Username" onChange={(e) => setUsername(e.target.value)} />
                        {UserNameErrors && (<p className="text-red-500 text-sm">{UserNameErrors}</p>)}
                    </div>
                    <div className=" p-2 flex flex-col gap-2">
                        <label>
                            Email
                        </label>
                        <input value={email} className="p-2 border rounded-sm outline-none" type="email" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} />
                        {EmailErrors && (<p className="text-red-500 text-sm">{EmailErrors}</p>)}
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
                        {PasswordErrors && (<p className="text-red-500 text-sm">{PasswordErrors}</p>)}
                    </div>
                    <div className="p-2 ">
                        {ServerErrors && (
                            <p className="text-red-500 text-sm pb-2">{ServerErrors}</p>
                        )}
                        {successMessage && (
                            <p className="text-green-700 text-sm pb-2 text-center">
                                {successMessage}
                            </p>
                        )}
                        {clientMessage && (
                            <p className="text-red-500 text-sm pb-2">
                                {clientMessage}
                            </p>
                        )}
                        <Button name="Register" bg="bg-indigo-600"/>
                    </div>
                </form>
                <h1>Already have an Account <span className="underline text-indigo-600"><Link to='/login'>Login</Link></span></h1>

            </section>
        </>
    )
}

export default RegisterPage
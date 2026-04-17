import { Link, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar"
import { CgProfile } from "react-icons/cg";
import { TbLogout } from "react-icons/tb";
import Button from "./Button";

const Navbar = ({isLoggedIn,setIsLoggedIn,user}) => {

  const navigate = useNavigate();

  const handleNavigateRegister = () => {
    navigate('/register')
  }
  const handleNavigateLogin = () => {
    navigate('/login')
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: "POST",
        credentials: "include"
      })

      setIsLoggedIn(false);
      localStorage.removeItem('isLoggedIn')
      navigate('/login')

    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  return (
    <>
      <nav className="bg-indigo-200 w-full h-12 flex justify-between items-center p-2">
        <div><Sidebar /></div>
        <div className="text-2xl font-bold hidden sm:flex">
          <Link to="/" className="text-indigo-600">Besocial</Link>
        </div>
        <div className="flex gap-2 items-center justify-center ">
          {!isLoggedIn ? (
            <div className="md:flex hidden gap-1">
              <Button func={handleNavigateLogin} name="Login" bg="bg-indigo-600"/>
              <Button func={handleNavigateRegister} name="Register" bg="bg-indigo-600"/>
            </div>
          )
            :
            (
              <div className="flex gap-2 items-center">
                <h1>{user?.name}</h1>
                <TbLogout className="cursor-pointer hover:text-red-500" onClick={handleLogout} size={25} />
              </div>
            )
          }
        </div>
      </nav>
    </>
  )
}

export default Navbar
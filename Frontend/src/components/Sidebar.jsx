import { GoSidebarCollapse } from "react-icons/go";
import { GoSidebarExpand } from "react-icons/go";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Button from "./Button";

const Sidebar = () => {
    const navigate = useNavigate();
    const [open, setIsOpen] = useState(false);
    function handleToggle() {
        setIsOpen(!open);
    }
    const handleNavigateRegister = () => {
        navigate('/register')
    }
    const handleNavigateLogin = () => {
        navigate('/login')
    }
    return (
        <>
            <div className="top-3 absolute">
                {!open && <GoSidebarCollapse size={25} onClick={handleToggle} />}
            </div>
            <aside className={`h-screen w-60 bg-indigo-200 fixed z-10 top-0 left-0 flex flex-col gap-3 ${open ? "translate-x-0" : "-translate-x-full"
                }`}>
                <div className="flex justify-between border-b p-2 mx-2 items-center">
                    <h1 className=" text-2xl font-bold text-indigo-600">Besocial</h1>
                    <GoSidebarExpand size={25} onClick={handleToggle} />
                </div>
                <div>
                    <nav className="flex flex-col gap-1">
                        <Link to="/create_post" className="p-2 hover:bg-indigo-100">Create Post</Link>
                        <Link to="/my_posts" className="p-2 hover:bg-indigo-100">My Posts</Link>
                        <Link to="/feed" className="p-2 hover:bg-indigo-100">Feed</Link>
                    </nav>
                    <div className="flex md:hidden gap-2 p-2">
                        <Button func={handleNavigateLogin} name="Login" bg="bg-indigo-600"/>
                        <Button func={handleNavigateRegister} name="Register" bg="bg-indigo-600"/>
                    </div>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
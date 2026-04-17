import { useState, useEffect } from "react"
import { IoMdCloseCircle } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const Posts = () => {

    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const checkAuth = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/me", {
                credentials: "include"
            });

            if (!res.ok) {
                return false;
            }

            return true;

        } catch {
            return false;
        }
    };

    const getData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/posts/mypost', {
                credentials: "include"
            });
            const result = await response.json();
            if (!response.ok) {
                navigate("/login");
                return;
            }
            setData(result.posts || [])
        }
        catch (err) {
            console.error(`Error: ${err}`)
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const verifyUser = async () => {
            const isAuth = await checkAuth();
            if (!isAuth) {
                navigate('/login')
                return;
            }
            getData();
        }
        verifyUser();
    }, [])

    async function handleDelete(id) {
        try {
            const data = await fetch(`http://localhost:8000/api/posts/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            const result = await data.json();
            console.log(result);

            // ui update
            setData((prev) => prev.filter((post) => post._id !== id));

        } catch (error) {
            console.error(`Error: ${error}`)
        }
    }

    return (
        <>
            <section className="py-11 px-2 flex gap-3 items-center justify-center flex-wrap ">
                {
                    loading ? (
                        <h1>Loading...</h1>
                    ) : !Array.isArray(data) || data.length === 0 ?
                        <h1>No Posts</h1>
                        :
                        data.map((post) => (
                            <div key={post._id} className="shadow-lg w-full max-w-sm overflow-hidden bg-indigo-200 rounded-md relative flex flex-col gap-3 justify-center">
                                <img className="w-full h-96 object-cover rounded-sm" src={post.image} alt="image" />
                                <h1 className="p-2 wrap-break-word">{post.caption}</h1>
                                <div className="absolute bottom-1 right-1 m-1">
                                    <IoMdCloseCircle className="hover:text-red-600 cursor-pointer" size={27} onClick={() => {
                                        handleDelete(post._id)
                                    }} />
                                </div>
                            </div>
                        ))
                }

            </section>
        </>
    )
}

export default Posts
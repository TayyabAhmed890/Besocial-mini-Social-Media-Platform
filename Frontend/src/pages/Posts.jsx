import { useState, useEffect } from "react"
import { FaHeart } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";

const Posts = ({ user }) => {

    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState([]);
    const currentUserId = user?.id;


    const getData = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/api/posts');
            const result = await response.json();
            setPosts(result.posts);
            console.log(result.posts)
        }
        catch (err) {
            console.error(`Error: ${err}`)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getData();
    }, [user])

    const handleLike = async (postId) => {
        try {
            const res = await fetch(`http://localhost:8000/api/posts/like/${postId}`, {
                method: "POST",
                credentials: "include"
            });

            const result = await res.json();

            if (!res.ok) return;

            // 🔥 FULL UPDATE
            setPosts(prev =>
                prev.map(post =>
                    post._id === postId
                        ? {
                            ...post,
                            likes: result.updatedLikes // backend se array bhejo
                        }
                        : post
                )
            );

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <section className="py-11 px-2 flex gap-3 items-center justify-center flex-wrap ">
                {
                    loading ? (
                        <h1>Loading...</h1>
                    ) : posts.length === 0 ?
                        <h1>No Posts</h1>
                        :
                        (
                            posts.map((post) => {
                                const isLiked =
                                    currentUserId &&
                                    post.likes?.some(id => id.toString() === currentUserId);

                                return (
                                    <div key={post._id} className="shadow-lg w-full max-w-sm bg-indigo-200 flex flex-col">

                                        <img className="w-full h-96 object-cover" src={post.image} />

                                        <div className="flex justify-between items-center p-3">

                                            <div>
                                                <h1>{post.caption}</h1>
                                                <p className="text-md font-semibold text-indigo-600">{post.user.username}</p>
                                            </div>

                                            <button
                                                onClick={() => handleLike(post._id)}
                                                className="flex items-center gap-1"
                                            >
                                                {
                                                    isLiked ? (
                                                        <FaHeart className="text-indigo-600" />
                                                    ) : (
                                                        <FiHeart className="hover:text-indigo-600" />
                                                    )
                                                }
                                                <span>{post.likes?.length || 0}</span>
                                            </button>

                                        </div>
                                    </div>
                                );
                            })
                        )
                }

            </section>
        </>
    )
}

export default Posts
import Button from "../components/Button"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom";

const CreatePosts = () => {

    const navigate = useNavigate();

    const [image, setImage] = useState(null);
    const [caption, setCaption] = useState("");
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const fileInputref = useRef(null);

    const sendData = async () => {
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("image", image);
            formData.append("caption", caption);
            const data = await fetch("http://localhost:8000/api/posts/create", {
                method: "POST",
                body: formData,
                credentials: "include"
            })
            const result = await data.json();
            if (!data.ok) {
                setServerError(result.message);
                setSuccessMessage("");
                setTimeout(() => {
                    setServerError("");
                }, 1000);
                return false;
            }

            setSuccessMessage("Post Created!");
            setServerError("");
            return true

        } catch (error) {
            console.error(`Error: ${error}`)
            setServerError("Network Error")
            setTimeout(() => {
                setServerError("");
            }, 2000);
            return false
        } finally {
            setTimeout(() => {
                setLoading(false)
            }, 2000);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (!image || caption === "") {
            setServerError("All fields are required");
            return;
        }

        const success = await sendData();

        if (!success) return;

        console.log("Form Submit")
        setCaption("");
        setImage(null);
        // actual state update
        fileInputref.current.value = "";

        setTimeout(() => {
            navigate('/feed')
        }, 2000)
    }

    return (
        <>
            <section className="p-3 flex items-center justify-center flex-col gap-4 w-full h-screen">
                <h1 className="text-3xl font-bold text-indigo-600 ">Create Post</h1>
                <form onSubmit={(e) => {
                    handleSubmit(e)
                }} className="gap-1 p-2 flex flex-col justify-center w-full max-w-75 mx-auto rounded-xl border">
                    <div className=" p-2 flex flex-col gap-2">
                        <label>
                            Image
                        </label>
                        <input className="p-2 border rounded-sm" ref={fileInputref} type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
                    </div>
                    <div className=" p-2 flex flex-col gap-2">
                        <label>
                            Caption
                        </label>
                        <input value={caption} className="p-2 border rounded-sm" type="text" placeholder="Write Caption Here" onChange={(e) => setCaption(e.target.value)} />
                    </div>
                    <div className="p-2 ">
                        <Button name="Create" bg='bg-indigo-600'/>
                    </div>
                </form>
                {successMessage && (
                    <h1 className="text-sm rounded-md text-white font-medium absolute bottom-1 p-3 bg-green-700">
                        {successMessage}
                    </h1>
                )}

                {serverError && (
                    <h1 className="text-sm rounded-md text-white font-medium absolute bottom-1 p-3 bg-red-600">
                        {serverError}
                    </h1>
                )}
            </section>
        </>
    )
}

export default CreatePosts
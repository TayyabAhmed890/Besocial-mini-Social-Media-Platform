import { useState } from "react";

const usePost = (url) => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const executePost = async (bodyData = null) => {
    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    const isFormData = bodyData instanceof FormData;

    // Body logic fix for empty POST requests (like Logout)
    let requestBody = undefined;
    if (bodyData) {
      requestBody = isFormData ? bodyData : JSON.stringify(bodyData);
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: isFormData || !bodyData ? {} : { "Content-Type": "application/json" },
        credentials: "include",
        body: requestBody,
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Something went wrong");
        return null;
      }

      setSuccessMessage(result.message || "Operation successful");
      return result;
    } catch (err) {
      console.error("API call error:", err);
      setServerError("Network error or server unreachable");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { executePost, loading, serverError, successMessage, setServerError };
};

export default usePost;
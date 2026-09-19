import { useState } from "react";

const useDelete = () => {
  const [loading, setLoading] = useState(false);

  const deleteItem = async (url, bodyData = null) => {
    setLoading(true);
    try {
      const options = {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      };

      // Agar bodyData provided ho to body Stringify karke attach karein
      if (bodyData) {
        options.body = JSON.stringify(bodyData);
      }

      const res = await fetch(url, options);
      const result = await res.json();
      setLoading(false);

      if (!res.ok) return { success: false, error: result.message };
      return { success: true, result };
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  return { deleteItem, isDeleting: loading };
};

export default useDelete;
import { useState, useEffect } from "react";

// auth hook
const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me", {
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setUser(data.user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch {
      setIsLoggedIn(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return {
    isLoggedIn,
    setIsLoggedIn,
    loading,
    user,
    setUser,
    checkAuth,
  };
};

export default useAuth;
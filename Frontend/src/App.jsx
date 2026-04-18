import CreatePosts from "./pages/CreatePosts"
import Posts from "./pages/Posts"
import MyPosts from "./pages/MyPosts"
import { Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import RegisterPage from "./pages/RegisterPage"
import LoginPage from "./pages/LoginPage"
import { useState, useEffect } from "react"
import ProtectedRoute from "./components/ProtectedRoute"

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null);

  const checkAuth = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/me", {
        credentials: "include"
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoggedIn(true);
        setUser(data.user); // 🔥 USER SAVE
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
  }, [])

  if (loading) {
    return <h1 className="text-center">Loading...</h1>;
  }

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />

      <Routes>
        <Route path="/" element={<HomePage user={user} />} />
        <Route path="/feed" element={<Posts user={user} isLoggedIn={isLoggedIn} />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage 
        setIsLoggedIn={setIsLoggedIn}
        setUser={setUser}
        checkAuth={checkAuth} />
        } />

        <Route path="/my_posts" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyPosts />
          </ProtectedRoute>
        } />
        <Route path="/create_post" element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <CreatePosts />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}

export default App

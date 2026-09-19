import CreatePosts from "./pages/CreatePosts";
import Posts from "./pages/Posts";
import MyPosts from "./pages/MyPosts";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuth from "./Hooks/useAuth"; // Custom Hook Import
import ProfilePage from "./pages/ProfilePage";
import AllUsers from "./pages/AllUsers";

function App() {
  const { isLoggedIn, setIsLoggedIn, loading, user, setUser, checkAuth } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wide text-slate-500 animate-pulse">
            Loading Besocial...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        user={user}
        setUser={setUser}
      />

      <Routes>
        <Route path="/" element={<HomePage user={user} isUserLoading={loading} />} />
        <Route
          path="/feed"
          element={<Posts user={user} isLoggedIn={isLoggedIn} />}
        />
        <Route 
          path="/register" 
          element={<RegisterPage setUser={setUser} setIsLoggedIn={setIsLoggedIn} />} 
        />
        <Route
          path="/login"
          element={
            <LoginPage
              setIsLoggedIn={setIsLoggedIn}
              setUser={setUser}
              checkAuth={checkAuth}
            />
          }
        />

        <Route
          path="/my_posts"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create_post"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <CreatePosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <AllUsers/>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
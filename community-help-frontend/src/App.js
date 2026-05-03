import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import "./App.css";

import API from "./services/api";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Home from "./pages/Home";

import ChatBot from "./components/ChatBot";

function App() {
  const [page, setPage] = useState("home");

  const [showModal, setShowModal] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  const [showMenu, setShowMenu] = useState(false);

  /* CURRENT USER */
  const user = JSON.parse(localStorage.getItem("user"));

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);

  /* APPLY THEME */
  useEffect(() => {
    document.body.className = theme;
    if (user) {
      fetchNotifications();
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  /* LOGOUT */
  const logout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    window.location.reload();
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(
        "/notifications",

        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        {/* LOGO */}
        <h2 className="logo">🌍 CommunityHub</h2>

        {/* NAV LINKS */}
        <div className="nav-links">
          <button onClick={() => setPage("home")}>Home</button>

          {!user && (
            <>
              <button onClick={() => setPage("login")}>Login</button>

              <button onClick={() => setPage("register")}>Register</button>
            </>
          )}

          {user?.role === "admin" && (
            <button onClick={() => setPage("admin")}>Admin</button>
          )}

          {/* THEME TOGGLE */}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {/* PROFILE */}
          {user && (
            
            <div className="profile-wrapper">
              <div
                className="nav-profile"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user.name?.charAt(0)}
              </div>

              {/* DROPDOWN */}
              {showMenu && (
                <div className="profile-dropdown">
                  <h4>{user.name}</h4>

                  <p>{user.email}</p>

                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <h1>Helping Communities Together 🤝</h1>

        <p>Share resources, request help, and support people around you.</p>
      </section>

      {/* PAGES */}
      <div className="page-container">
        {page === "login" && <Login />}

        {page === "register" && <Register />}

        {page === "home" && <Home />}

        {page === "admin" && <AdminDashboard />}
      </div>

      {/* FLOATING BUTTON */}
      <button className="floating-btn" onClick={() => setShowModal(true)}>
        +
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>

            <CreatePost />
          </div>
        </div>
      )}

      {/* CHATBOT */}
      <ChatBot />

      {/* TOASTS */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;

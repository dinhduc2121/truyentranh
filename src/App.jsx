import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Search from "./components/Search";
import Detail from "./components/Detail";
import Read from "./components/Read";
import Login from "./components/Login";
import Register from "./components/Register";
import CategoryPage from "./components/CategoryPage";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import AdminUserManager from "./admin/AdminDashboard";

// Các trang placeholder sẽ bổ sung sau
const Hot = () => <div className="p-4">Truyện Hot (đang phát triển)</div>;
const Full = () => <div className="p-4">Truyện Full (đang phát triển)</div>;

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(() => {
    // Giả sử đoạn này lấy user từ localStorage:
    const userStr = localStorage.getItem("user");
    let user = null;
    try {
      user = userStr && userStr !== "undefined" ? JSON.parse(userStr) : null;
    } catch (e) {
      user = null;
    }
    return user;
  });

  // Lấy thể loại từ API the-loai (chỉ lấy 1 lần)
  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/the-loai")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.data || []);
      });
  }, []);

  const handleLogin = ({ token, username }) => {
    setUser({ token, username });
    localStorage.setItem("user", JSON.stringify({ token, username }));
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <div className="min-h-screen bg-white text-black pt-16 px-4 flex flex-col">
        <Navbar categories={categories} onSelectCategory={setSelectedCategory} user={user} onLogout={handleLogout} />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={
              <Home
                selectedCategory={selectedCategory}
                categories={categories}
                onSelectCategory={setSelectedCategory}
                user={user}
              />
            } />
            <Route path="/the-loai" element={
              <CategoryPage categories={categories} />
            } />
            <Route path="/the-loai/:slug" element={
              <CategoryPage categories={categories} />
            } />
            <Route path="/hot" element={<Hot />} />
            <Route path="/full" element={<Full />} />
            <Route path="/search" element={<Search />} />
            <Route path="/truyen/:slug" element={<Detail user={user} />} />
            <Route path="/doc/:slug/:chapter" element={<Read user={user} />} />
            <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
            <Route path="/admin/users" element={<AdminUserManager user={user} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
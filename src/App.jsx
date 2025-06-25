import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Search from "./components/Search";
import Detail from "./components/Detail";
import Read from "./components/Read";

// Các trang placeholder sẽ bổ sung sau
const Hot = () => <div className="p-4">Truyện Hot (đang phát triển)</div>;
const Full = () => <div className="p-4">Truyện Full (đang phát triển)</div>;

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Lấy thể loại từ Home API (chỉ lấy 1 lần)
  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/home")
      .then((res) => res.json())
      .then((data) => {
        const allCats = [];
        (data.data?.items || []).forEach((item) => {
          if (Array.isArray(item.category)) {
            item.category.forEach((cat) => {
              if (!allCats.find((c) => c.id === cat.id)) {
                allCats.push(cat);
              }
            });
          }
        });
        setCategories(allCats);
      });
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-black text-white pt-16 px-4">
        <Navbar categories={categories} onSelectCategory={setSelectedCategory} />
        <Routes>
          <Route path="/" element={<Home selectedCategory={selectedCategory} />} />
          <Route path="/hot" element={<Hot />} />
          <Route path="/full" element={<Full />} />
          <Route path="/search" element={<Search />} />
          <Route path="/truyen/:slug" element={<Detail />} />
          <Route path="/doc/:slug/:chapter" element={<Read />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

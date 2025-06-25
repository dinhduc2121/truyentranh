import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ categories = [], onSelectCategory }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg z-50">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-2xl font-bold text-white tracking-wide">
          <span className="text-yellow-300">V</span>ẽ Mộng
        </Link>
        <div className="flex gap-4 items-center">
          <Link to="/" className="text-white hover:text-yellow-300 font-medium transition">Trang chủ</Link>
          <Link to="/hot" className="text-white hover:text-yellow-300 font-medium transition">Truyện hot</Link>
          <Link to="/full" className="text-white hover:text-yellow-300 font-medium transition">Truyện full</Link>
          <div className="relative">
            <button
              className="text-white hover:text-yellow-300 font-medium transition flex items-center gap-1"
              onClick={() => setShowDropdown((v) => !v)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            >
              Thể loại
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow-lg z-50 max-h-80 overflow-y-auto">
                <button
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 text-black"
                  onClick={() => { onSelectCategory(null); setShowDropdown(false); }}
                >Tất cả</button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-indigo-100 text-black"
                    onClick={() => { onSelectCategory(cat.id); setShowDropdown(false); }}
                  >{cat.name}</button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded px-2 py-1 ml-2">
            <input
              type="text"
              placeholder="Tìm kiếm truyện..."
              className="outline-none text-black bg-transparent px-2 py-1 w-32 md:w-48"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="text-indigo-600 font-bold px-2">🔍</button>
          </form>
          <a href="https://otruyen.cc/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-yellow-300 font-medium transition">Nguồn gốc</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

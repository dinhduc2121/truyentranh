import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

// Mobile menu component
function MobileMenu({ open, onClose, categories, user, onLogout, historyComics, readingHistory }) {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div
      className={`fixed inset-0 z-[999] bg-black bg-opacity-40 transition-opacity duration-200 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={onClose}
    >
      <div
        className={`fixed top-0 right-0 h-full w-72 max-w-full bg-white text-black shadow-lg z-[1000] transform transition-transform duration-200 ${open ? "translate-x-0" : "translate-x-full"}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <span className="font-bold text-lg">Menu</span>
          <button onClick={onClose} className="text-2xl font-bold">&times;</button>
        </div>
        <div className="p-4 flex flex-col gap-4 overflow-y-auto h-[calc(100vh-56px)]">
          {/* Thể loại */}
          <div>
            <button
              className="font-semibold mb-2 flex items-center gap-2 text-left w-full"
              onClick={() => setShowCategories(v => !v)}
            >
              Thể loại
              <svg className={`w-4 h-4 transition-transform ${showCategories ? "rotate-90" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            {showCategories && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm mt-2">
                {categories.map(cat => (
                  <Link
                    key={cat.id}
                    to={`/the-loai/${cat.slug}`}
                    className="hover:text-[#ff4e8a] text-gray-800"
                    onClick={onClose}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* Lịch sử đọc */}
          {user && (
            <div>
              <div className="font-semibold mb-2">Lịch sử đọc truyện</div>
              {readingHistory.length === 0 ? (
                <div className="text-xs text-gray-500">Bạn chưa đọc truyện nào.</div>
              ) : (
                <ul className="text-xs text-gray-800 space-y-2">
                  {[...new Set(readingHistory.map(h => h.slug))].slice(0, 10).map((slug, idx) => {
                    const comic = historyComics[slug];
                    return (
                      <li key={slug} className="flex items-center gap-2">
                        <Link to={`/truyen/${slug}`} onClick={onClose}>
                          <img
                            src={
                              comic?.thumb_url
                                ? (comic.thumb_url.startsWith("http")
                                  ? comic.thumb_url
                                  : `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`)
                                : "https://via.placeholder.com/40x56?text=No+Img"
                            }
                            alt={comic?.name || slug}
                            className="w-8 h-12 object-cover rounded border"
                          />
                        </Link>
                        <Link to={`/truyen/${slug}`} className="font-semibold hover:underline text-sm line-clamp-1" onClick={onClose}>
                          {comic?.name || slug}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
          {/* Theo dõi */}
          {user && (
            <Link to="/follow" className="block font-semibold text-[#5a469a] hover:underline" onClick={onClose}>
              Truyện theo dõi
            </Link>
          )}
          {/* Thông tin tài khoản */}
          <div>
            <Link
              to="/profile"
              className="font-semibold mb-2 flex items-center gap-2 text-left w-full py-2 px-2 rounded hover:bg-gray-100"
              onClick={onClose}
            >
              <svg className="w-5 h-5 text-[#5a469a]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8z"/>
              </svg>
              Thông tin tài khoản
            </Link>
          </div>
          {/* Tài khoản */}
          <div>
            {user ? (
              <button onClick={() => { onLogout(); onClose(); }} className="w-full py-2 bg-red-500 text-white rounded font-semibold mt-2">
                Đăng xuất
              </button>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link to="/login" className="flex-1 py-2 bg-indigo-600 text-white rounded text-center font-semibold" onClick={onClose}>Đăng nhập</Link>
                <Link to="/register" className="flex-1 py-2 bg-gray-300 text-black rounded text-center font-semibold" onClick={onClose}>Đăng ký</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Navbar = ({ user, onLogout }) => {
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const navigate = useNavigate();

  // Lấy thể loại
  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/the-loai/")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data?.data?.items) ? data.data.items : [];
        setCategories(list.filter(cat => !!cat.slug));
      });
  }, []);

  // Lấy lịch sử đọc nếu đã đăng nhập
  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:3001/api/user/history", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setReadingHistory(data.readingHistory || []));
  }, [user]);

  // Lấy thông tin truyện cho từng lịch sử đọc (chỉ lấy tên và ảnh)
  useEffect(() => {
    if (!user?.token || !readingHistory.length) return;
    const uniqueSlugs = [...new Set(readingHistory.map(h => h.slug))];
    Promise.all(
      uniqueSlugs.map(slug =>
        fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
          .then(res => res.json())
          .then(data => ({
            slug,
            name: data.data?.item?.name || slug,
            thumb_url: data.data?.item?.thumb_url || ""
          }))
      )
    ).then(arr => {
      const obj = {};
      arr.forEach(item => { obj[item.slug] = item; });
      setHistoryComics(obj);
    });
  }, [user, readingHistory]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  // Responsive: nhỏ chữ trên mobile
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-[#44346a] shadow z-50 border-b border-[#4e3a7a] font-sans h-14 flex items-center">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2 sm:px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center select-none">
            <span className="text-xl sm:text-2xl font-extrabold tracking-wide" style={{
              fontFamily: "'Baloo 2', cursive",
              color: "#fff",
              letterSpacing: "1px",
              textShadow: "0 1px 2px #000"
            }}>
              <span style={{
                color: "#3ec6e0",
                textShadow: "0 1px 2px #000"
              }}>Mộng</span>
              <span style={{
                color: "#ff4e8a",
                textShadow: "0 1px 2px #000"
              }}>Truyện</span>
            </span>
          </Link>
          {/* Desktop: Thể loại + Search + User */}
          <div className="hidden md:flex items-center flex-1 justify-between ml-4">
            {/* Thể loại */}
            <div className="relative">
              <button
                className="text-white bg-[#5a469a] hover:bg-[#6d59b8] rounded px-3 py-1 text-xs sm:text-sm font-bold flex items-center gap-1"
                type="button"
                onClick={() => navigate("/the-loai")}
              >
                Thể loại
              </button>
            </div>
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex justify-center px-2">
              <input
                type="text"
                placeholder="Tìm truyện..."
                className="w-full max-w-xl px-4 py-2 rounded bg-white text-black outline-none text-xs sm:text-base"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button type="submit" className="ml-[-2.5rem] text-gray-700 text-xl bg-transparent border-0">
                <span role="img" aria-label="search">🔍</span>
              </button>
            </form>
            {/* User */}
            <div className="flex items-center gap-2">
              <Link
                to={user ? "/profile" : "/login"}
                className="text-white text-xs sm:text-sm font-semibold hover:underline"
              >
                {user ? (user.username || user) : "Tài khoản"}
              </Link>
              {user && (
                <button onClick={onLogout} className="text-xs sm:text-sm text-white bg-red-500 rounded px-2 py-1 ml-1">Đăng xuất</button>
              )}
            </div>
          </div>
          {/* Mobile: 3 gạch */}
          <button
            className="md:hidden flex items-center justify-center text-white text-2xl p-2"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
          >
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </nav>
      {/* Mobile menu */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        categories={categories}
        user={user}
        onLogout={onLogout}
        historyComics={historyComics}
        readingHistory={readingHistory}
      />
      {/* Padding top for fixed navbar */}
      <div className="h-14" />
    </>
  );
};

export default Navbar;



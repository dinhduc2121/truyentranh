import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import CommentSection from "./CommentSection";

const ChapterNav = ({
  slug,
  allChapters,
  currentChapterIdx,
  prevIdx,
  nextIdx,
  goToChapter,
  showChapterList,
  setShowChapterList,
  renderChapterList,
  className = "",
  style = {},
  isFollowing,
  toggleFollow,
}) => (
  <div className={`bg-white border-b w-full max-w-4xl shadow-md ${className}`} style={style}>
    <div className="flex items-center gap-3 justify-center py-3 px-4 relative">
      {/* Về trang chủ */}
      <Link to="/" className="p-2 rounded hover:bg-gray-100 transition" title="Trang chủ">
        <svg width="24" height="24" fill="none" stroke="#2196f3" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M3 12l9-9 9 9" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9 21V9h6v12" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
      {/* Danh sách chương */}
      <Link to={`/truyen/${slug}`} className="p-2 rounded hover:bg-gray-100 transition" title="Danh sách chương">
        <svg width="24" height="24" fill="none" stroke="#2196f3" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 10h18" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
      {/* Chương trước */}
      <button
        className={`p-2 rounded ${prevIdx === -1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 transition"}`}
        title="Chương trước"
        disabled={prevIdx === -1}
        onClick={() => goToChapter(prevIdx)}
      >
        <svg width="24" height="24" fill="none" stroke="#2196f3" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* Số chương hiện tại */}
      <div className="relative">
        <button
          className="px-4 py-2 rounded-lg border text-sm font-semibold bg-gray-100 text-[#2196f3] hover:bg-gray-200 transition"
          onClick={() => setShowChapterList(v => !v)}
        >
          {allChapters[currentChapterIdx]?.chapter_name || "Chọn chương"}
        </button>
        {showChapterList && renderChapterList()}
      </div>
      {/* Chương tiếp theo */}
      <button
        className={`p-2 rounded ${nextIdx === -1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100 transition"}`}
        title="Chương tiếp"
        disabled={nextIdx === -1}
        onClick={() => goToChapter(nextIdx)}
      >
        <svg width="24" height="24" fill="none" stroke="#2196f3" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {/* Theo dõi/Bỏ theo dõi */}
      <button
        onClick={toggleFollow}
        className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition ${
          isFollowing
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-[#ffb300] text-white hover:bg-[#e0a800]"
        }`}
      >
        <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
      </button>
    </div>
  </div>
);

const Read = ({ user }) => {
  const { slug, chapter } = useParams();
  const [images, setImages] = useState([]);
  const [imgLoading, setImgLoading] = useState(true);
  const [imgError, setImgError] = useState(null);
  const [allChapters, setAllChapters] = useState([]);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(-1);
  const [showChapterList, setShowChapterList] = useState(false);
  const [comicName, setComicName] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");
  const [readingHistory, setReadingHistory] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const chapterListRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();

  // Fetch truyện và chapter
  useEffect(() => {
    setImgLoading(true);
    setImgError(null);

    fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
      .then(res => res.json())
      .then(data => {
        const comic = data.data?.item;
        setComicName(comic?.name || "");
        setUpdatedAt(comic?.updatedAt || "");
        if (!comic || !comic.chapters) throw new Error("Không tìm thấy truyện hoặc chương");

        // Lấy danh sách tất cả chapter (flatten)
        let chapters = [];
        comic.chapters.forEach(server => {
          if (Array.isArray(server.server_data)) {
            chapters = chapters.concat(server.server_data);
          }
        });
        // Sắp xếp giảm dần theo số chương
        chapters.sort((a, b) => {
          const aNum = parseFloat(a.chapter_name.replace(/[^\d.]/g, "")) || 0;
          const bNum = parseFloat(b.chapter_name.replace(/[^\d.]/g, "")) || 0;
          return bNum - aNum;
        });
        setAllChapters(chapters);

        // Xác định index chương hiện tại
        const chapterParam = decodeURIComponent(chapter).replace(/\s+/g, " ").trim().toLowerCase();
        const idx = chapters.findIndex(
          c => c.chapter_name.replace(/\s+/g, " ").trim().toLowerCase() === chapterParam
        );
        setCurrentChapterIdx(idx);

        // Lấy ảnh chương
        if (idx === -1) throw new Error("Không tìm thấy chương này");
        const chapterObj = chapters[idx];
        return fetch(chapterObj.chapter_api_data)
          .then(res => res.json())
          .then(chapData => {
            const domain = chapData.data?.domain_cdn;
            const path = chapData.data?.item?.chapter_path;
            const files = chapData.data?.item?.chapter_image ?? [];
            const imgs = files.map(f => `${domain}/${path}/${f.image_file}`);
            setImages(imgs);
            setImgLoading(false);
          });
      })
      .catch((e) => {
        setImgError("Lỗi khi tải chương truyện");
        setImgLoading(false);
      });
  }, [slug, chapter]);

  // Kiểm tra trạng thái theo dõi
  useEffect(() => {
    if (!user?.token) return;
    fetch(`http://localhost:3001/api/user/is-following/${slug}`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then(res => res.json())
      .then(data => setIsFollowing(data.isFollowing));
  }, [user, slug]);

  // Xử lý theo dõi/bỏ theo dõi
  const toggleFollow = async () => {
    if (!user?.token) {
      navigate("/login");
      return;
    }
    try {
      const endpoint = isFollowing ? "/unfollow" : "/follow";
      await axios.post(
        `http://localhost:3001/api/user${endpoint}`,
        { slug },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Lỗi khi thay đổi trạng thái theo dõi:", err);
    }
  };

  // Đóng danh sách chương khi click ngoài
  useEffect(() => {
    if (!showChapterList) return;
    const handleClick = (e) => {
      if (chapterListRef.current && !chapterListRef.current.contains(e.target)) {
        setShowChapterList(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showChapterList]);

  // Lưu lịch sử đọc
  useEffect(() => {
    if (!user?.token || !slug || !chapter) return;
    fetch("http://localhost:3001/api/user/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ slug, chapter })
    }).then(() => {
      fetch("http://localhost:3001/api/user/history", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => res.json())
        .then(data => setReadingHistory(data.readingHistory || []));
    });
  }, [user, slug, chapter]);

  // Xử lý chuyển chương
  const goToChapter = (idx) => {
    if (idx >= 0 && idx < allChapters.length) {
      const chap = allChapters[idx];
      navigate(`/doc/${slug}/${encodeURIComponent(chap.chapter_name)}`);
      setShowChapterList(false);
    }
  };

  // Hàm kiểm tra chương đã đọc
  const isChapterRead = (slug, chapterName) => {
    const history = readingHistory.find(h => h.slug === slug);
    if (!history) return false;
    const parseNum = ch => {
      const n = parseFloat(String(ch).replace(/[^\d.]/g, ""));
      return isNaN(n) ? 0 : n;
    };
    const currentNum = parseNum(chapterName);
    const savedNum = parseNum(history.chapter);
    return currentNum > 0 && savedNum > 0 && currentNum <= savedNum;
  };

  // Hiển thị danh sách chương
  const renderChapterList = () => (
    <div
      ref={chapterListRef}
      className="absolute left-1/2 -translate-x-1/2 top-12 z-50 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto w-64"
    >
      <div className="grid gap-2 p-3" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}>
        {allChapters.map((chap, idx) => (
          <button
            key={chap.chapter_name}
            className={`px-3 py-2 rounded-lg text-sm border transition ${
              idx === currentChapterIdx
                ? "bg-[#ffb300] text-white"
                : isChapterRead(slug, chap.chapter_name)
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => goToChapter(idx)}
          >
            <span>{chap.chapter_name}</span>
            {user && isChapterRead(slug, chap.chapter_name) && (
              <span className="block text-[10px] font-semibold">Đã đọc</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  // Lấy chương trước/sau
  const prevIdx = currentChapterIdx + 1 < allChapters.length ? currentChapterIdx + 1 : -1;
  const nextIdx = currentChapterIdx - 1 >= 0 ? currentChapterIdx - 1 : -1;

  // Sticky nav và nút lên đầu
  const [showStickyNav, setShowStickyNav] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (navRef.current) {
        const { top } = navRef.current.getBoundingClientRect();
        setShowStickyNav(top <= 0);
      }
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4 my-4">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-4">
          <Link to="/" className="hover:underline text-[#2196f3] font-medium">Trang chủ</Link>
          <span>»</span>
          <Link to="/the-loai" className="hover:underline text-[#2196f3] font-medium">Thể loại</Link>
          <span>»</span>
          Ese
          <Link to={`/truyen/${slug}`} className="hover:underline text-[#2196f3] font-medium">{comicName}</Link>
          <span>»</span>
          <span className="font-semibold text-[#2196f3]">
            Chapter {allChapters[currentChapterIdx]?.chapter_name || chapter}
          </span>
          {updatedAt && (
            <span className="ml-2 text-gray-500 text-xs">
              [Cập nhật: {new Date(updatedAt).toLocaleString()}]
            </span>
          )}
        </div>

        {/* Thanh điều hướng chương chính */}
        <div ref={navRef}>
          <ChapterNav
            slug={slug}
            allChapters={allChapters}
            currentChapterIdx={currentChapterIdx}
            prevIdx={prevIdx}
            nextIdx={nextIdx}
            goToChapter={goToChapter}
            showChapterList={showChapterList}
            setShowChapterList={setShowChapterList}
            renderChapterList={renderChapterList}
            isFollowing={isFollowing}
            toggleFollow={toggleFollow}
          />
        </div>

        {/* Thanh điều hướng sticky */}
        {showStickyNav && (
          <ChapterNav
            slug={slug}
            allChapters={allChapters}
            currentChapterIdx={currentChapterIdx}
            prevIdx={prevIdx}
            nextIdx={nextIdx}
            goToChapter={goToChapter}
            showChapterList={showChapterList}
            setShowChapterList={setShowChapterList}
            renderChapterList={renderChapterList}
            isFollowing={isFollowing}
            toggleFollow={toggleFollow}
            className="fixed top-0 left-1/2 -translate-x-1/2 z-50"
            style={{ minWidth: 320 }}
          />
        )}

        {/* Nội dung chương */}
        <div style={{ paddingTop: showStickyNav ? "60px" : 0 }}>
          <div className="flex flex-col gap-4 items-center">
            {imgLoading ? (
              <div className="text-gray-500 py-8 text-lg">Đang tải ảnh chương...</div>
            ) : imgError ? (
              <div className="text-red-500 py-8 text-lg">{imgError}</div>
            ) : images.length > 0 ? (
              images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Trang ${idx + 1}`}
                  className="w-full max-w-3xl rounded-lg shadow-md"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ))
            ) : (
              <div className="text-gray-500 py-8 text-lg">Không có ảnh cho chương này.</div>
            )}
          </div>
        </div>

        {/* Phần bình luận */}
        <CommentSection comicSlug={slug} user={user} />

        {/* Nút lên đầu trang */}
        {showScrollTop && (
          <button
            className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-[#2196f3] text-white hover:bg-[#1976d2] shadow-lg transition"
            title="Lên đầu trang"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Read;
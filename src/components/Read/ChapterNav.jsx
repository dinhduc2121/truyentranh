import React from "react";
import { Link } from "react-router-dom";

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
  isFollowing,
  toggleFollow,
  className = "",
  style = {},
}) => {
  return (
    <div
      className={`bg-gradient-to-r from-[#2196f3] to-[#1976d2] border-b w-full shadow-lg rounded-b-lg ${className}`}
      style={style}
    >
      <div className="flex items-center gap-4 justify-center py-4 px-6 relative w-full max-w-5xl mx-auto">
        {/* Về trang chủ */}
        <Link
          to="/"
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 hover:scale-110 transition-transform duration-200"
          title="Về trang chủ"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M3 12l9-9 9 9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 21V9h6v12"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Danh sách chương */}
        <Link
          to={`/truyen/${slug}`}
          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 hover:scale-110 transition-transform duration-200"
          title="Quay lại chi tiết truyện"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect
              x="3"
              y="4"
              width="18"
              height="16"
              rx="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3 10h18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>

        {/* Chương trước */}
        <button
          className={`p-3 rounded-full bg-white/20 text-white hover:bg-white/30 hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          title={prevIdx !== -1 ? `Chương ${allChapters[prevIdx]?.chapter_name}` : "Không có chương trước"}
          disabled={prevIdx === -1}
          onClick={() => goToChapter(prevIdx)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 19l-7-7 7-7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Tên chương hiện tại */}
        <div className="relative flex-1 max-w-xs">
          <button
            className="w-full px-4 py-2 rounded-lg border border-white/30 bg-white/10 text-white font-semibold flex items-center justify-between gap-2 hover:bg-white/20 transition duration-200"
            onClick={() => setShowChapterList((v) => !v)}
          >
            <span>Chapter {allChapters[currentChapterIdx]?.chapter_name || "Chọn chương"}</span>
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              className={`transform transition-transform duration-200 ${showChapterList ? "rotate-180" : ""}`}
            >
              <path
                d="M6 9l6 6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          {showChapterList && (
            <div className="absolute top-full left-0 z-10 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200">
              {renderChapterList()}
            </div>
          )}
        </div>

        {/* Chương tiếp theo */}
        <button
          className={`p-3 rounded-full bg-white/20 text-white hover:bg-white/30 hover:scale-110 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
          title={nextIdx !== -1 ? `Chương ${allChapters[nextIdx]?.chapter_name}` : "Khôngமை có chương tiếp theo"}
          disabled={nextIdx === -1}
          onClick={() => goToChapter(nextIdx)}
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 5l7 7-7 7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Theo dõi / Bỏ theo dõi */}
        <button
          onClick={toggleFollow}
          className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm transition ${
            isFollowing
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-[#ffb300] text-white hover:bg-[#e0a800]"
          }`}
        >
          <svg
            width="18"
            height="18"
            fill="currentColor"
            viewBox="0 0 24 24"
            className="transform hover:scale-110 transition-transform duration-200"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
            2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 
            4.5 2.09C13.09 3.81 14.76 3 16.5 
            3 19.58 3 22 5.42 22 8.5c0 
            3.78-3.4 6.86-8.55 11.54L12 
            21.35z" />
          </svg>
          {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
        </button>
      </div>
    </div>
  );
};

export default ChapterNav;
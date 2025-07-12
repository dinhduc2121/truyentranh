import React, { forwardRef } from "react";

const ChapterList = forwardRef(
  ({ allChapters, currentChapterIdx, goToChapter, isChapterRead, slug, user }, ref) => {
    return (
      <div
        ref={ref}
        className="absolute left-1/2 -translate-x-1/2 top-12 z-50 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto w-64"
      >
        <div
          className="grid gap-2 p-3"
          style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))" }}
        >
          {allChapters.map((chap, idx) => (
            <button
              key={chap.chapter_name}
              onClick={() => goToChapter(idx)}
              className={`px-3 py-2 rounded-lg text-sm border transition text-left leading-tight ${
                idx === currentChapterIdx
                  ? "bg-[#ffb300] text-white"
                  : isChapterRead(slug, chap.chapter_name)
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="block truncate">{chap.chapter_name}</span>
              {user && isChapterRead(slug, chap.chapter_name) && (
                <span className="block text-[10px] font-semibold text-green-600">
                  Đã đọc
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }
);

export default ChapterList;

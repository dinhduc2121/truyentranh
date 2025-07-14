import React, { useState } from "react";
import { API_BASE_URL } from "../../../config";

const ChapterList = ({ chapters, slug, user, readingHistory, handleClickChapter, isChapterRead }) => {
  const [showAll, setShowAll] = useState(false);
  const maxInitialChapters = 20;
  const chapterData = chapters?.[0]?.server_data || [];
  const displayedChapters = showAll ? chapterData : chapterData.slice(0, maxInitialChapters);

  return (
    <div className="mt-6 bg-white rounded shadow p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-semibold text-lg text-[#222]">Danh sách chương</span>
        <span className="text-xs text-gray-500">({chapterData.length || 0} chương)</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-2 border-b text-left">Số chương</th>
              <th className="py-2 px-2 border-b text-left">Cập nhật</th>
              <th className="py-2 px-2 border-b text-left">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {displayedChapters.map((chap, idx) => (
              <tr key={chap.chapter_name || idx} className="border-b hover:bg-gray-50">
                <td className="py-1 px-2">
                  <button
                    onClick={() => handleClickChapter(chap.chapter_name)}
                    className="text-blue-700 hover:underline"
                  >
                    Chapter {chap.chapter_name}
                  </button>
                </td>
                <td className="py-1 px-2 text-gray-500">{chap.time || "-"}</td>
                <td className="py-1 px-2">
                  {user && isChapterRead(slug, chap.chapter_name) && (
                    <span className="text-green-600 text-xs font-semibold">Đã đọc</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {chapterData.length > maxInitialChapters && !showAll && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold"
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
};

export default ChapterList;
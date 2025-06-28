import React, { useState } from "react";

const tabs = [
  { label: "Top Tháng", key: "month" },
  { label: "Top Tuần", key: "week" },
  { label: "Top Ngày", key: "day" },
];

function getRandomItems(arr, n = 5) {
  if (!Array.isArray(arr) || arr.length === 0) return [];
  const shuffled = arr.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

const TopRanking = ({ comics = [] }) => {
  const [activeTab, setActiveTab] = useState("month");
  const data = comics && comics.length > 0 ? getRandomItems(comics, 5) : [];

  return (
    <div className="bg-white rounded shadow p-3 w-full max-w-xs">
      <div className="flex border-b mb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`flex-1 py-1 text-xs md:text-sm font-bold border-b-2 transition-colors ${activeTab === tab.key ? "border-[#ffb300] text-[#ffb300]" : "border-transparent text-gray-700"}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <ul>
        {data.length === 0 ? (
          <li className="text-center text-gray-400 text-sm py-4">Không có dữ liệu</li>
        ) : (
          data.map((item, idx) => (
            <li key={idx} className="flex items-center gap-2 py-2 border-b last:border-b-0">
              <span className="text-lg font-bold text-[#ffb300] w-6 text-center">{String(idx + 1).padStart(2, "0")}</span>
              <img src={item.thumb_url ? `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}` : "https://via.placeholder.com/40x56?text=No+Img"} alt={item.name} className="w-10 h-14 object-cover rounded" />
              <div className="flex-1">
                <div className="font-semibold text-xs md:text-sm text-[#2b1e4a] line-clamp-1">{item.name}</div>
                <div className="text-xs text-gray-500">Chapter {item.chap || item.chapter || "?"}</div>
              </div>
              <span className="text-xs text-gray-400">{item.views || "-"}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopRanking;

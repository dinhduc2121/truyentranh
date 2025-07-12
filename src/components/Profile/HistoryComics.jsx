
import React from "react";
import { Link } from "react-router-dom";

const HistoryComics = ({ history }) => (
  <div id="history-tab">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {history.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-8">
          Bạn chưa đọc truyện nào.
        </div>
      ) : (
        history.map((item, idx) => (
          <div
            key={item.slug + idx}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={
                  item.thumb_url
                    ? (item.thumb_url.startsWith("http")
                        ? item.thumb_url
                        : `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`)
                    : "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 hover:text-blue-600 cursor-pointer">
                <Link to={`/truyen/${item.slug}`}>{item.name}</Link>
              </h3>
              <div className="text-gray-600 text-sm mb-2">
                Chương đã đọc: {item.chapter || "?"}
              </div>
              <div className="text-xs text-gray-400">
                Cập nhật:{" "}
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);

export default HistoryComics;

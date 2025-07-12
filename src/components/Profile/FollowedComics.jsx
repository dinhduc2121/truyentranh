import React from "react";
import { Link } from "react-router-dom";

const FollowedComics = ({ comics }) => (
  <div id="followed-tab">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {comics.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 py-8">
          Bạn chưa theo dõi truyện nào.
        </div>
      ) : (
        comics.map(comic => (
          <div
            key={comic.slug}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg"
          >
            <div className="relative">
              <img
                src={
                  comic.thumb_url
                    ? (comic.thumb_url.startsWith("http")
                        ? comic.thumb_url
                        : `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`)
                    : "https://via.placeholder.com/600x400?text=No+Image"
                }
                alt={comic.name}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                  comic.status === "Hoàn thành"
                    ? "bg-green-500 text-white"
                    : "bg-yellow-500 text-white"
                }`}
              >
                {comic.status || "Đang tiến hành"}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 hover:text-blue-600 cursor-pointer">
                <Link to={`/truyen/${comic.slug}`}>{comic.name}</Link>
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                Tác giả: {comic.author || "?"}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  Chương mới nhất:{" "}
                  <span className="font-semibold">{comic.chap || "?"}</span>
                </span>
                <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">
                  Hủy theo dõi
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
    {comics.length > 0 && (
      <div className="flex justify-center">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Xem thêm
        </button>
      </div>
    )}
  </div>
);

export default FollowedComics;

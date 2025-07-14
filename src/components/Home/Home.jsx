import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import TopRanking from "./TopRanking";
import { useFollowedComics } from "../Read/hooks/useFollowedComics";
import HomeComments from "./HomeComments";
import "../../../src/index.css";
import CalendarWidget from "./CalendarWidget";
import { API_BASE_URL } from "../../../config";

const Home = ({ user }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const [homeComments, setHomeComments] = useState([]);
  const { followedComics } = useFollowedComics({ user });

  const cdnDomain = "https://img.otruyenapi.com";

  // Load danh sách truyện
  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://otruyenapi.com/v1/api/danh-sach?type=truyen-moi&page=${page}`)
      .then((res) => res.json())
      .then((data) => {
        const items = data.data?.items || [];
        setComics(items);

        const pagination = data.data?.params?.pagination;
        const total = pagination
          ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
          : 1;
        setTotalPages(total);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/user/history`, {
      headers: { Authorization: `Bearer ${user.token}` },
    })
      .then((res) => res.json())
      .then((data) => setReadingHistory(data.readingHistory || []));
  }, [user]);

  useEffect(() => {
    if (!user?.token || !readingHistory.length) return;
    const uniqueSlugs = [...new Set(readingHistory.map((h) => h.slug))];
    Promise.all(
      uniqueSlugs.map((slug) =>
        fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
          .then((res) => res.json())
          .then((data) => ({
            slug,
            name: data.data?.item?.name || slug,
            thumb_url: data.data?.item?.thumb_url || "",
          }))
      )
    ).then((arr) => {
      const obj = {};
      arr.forEach((item) => {
        obj[item.slug] = item;
      });
      setHistoryComics(obj);
    });
  }, [user, readingHistory]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/comments`)
      .then((res) => res.json())
      .then((data) => {
        setHomeComments(
          data.comments.filter((c) => c.comicSlug === "homepage")
        );
      })
      .catch((err) => {
        console.error("Lỗi khi tải bình luận:", err);
        setError("Không thể tải bình luận");
      });
  }, []);
  const handleAddComment = async (content) => {
    const res = await fetch(`${API_BASE_URL}/api/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.token}`,
      },
      body: JSON.stringify({
        comicSlug: "homepage",
        content,
      }),
    });

    if (!res.ok) throw new Error("Gửi bình luận thất bại");
    const data = await res.json();
    setHomeComments((prev) => [data.comment, ...prev]);
    return data.comment;
  };

  const goToPage = (p) => setSearchParams({ page: p });

  if (loading)
    return (
      <div className="bg-[#222] min-h-screen flex items-center justify-center text-white text-xl">
        Đang tải...
      </div>
    );
  if (error)
    return (
      <div className="bg-[#222] min-h-screen flex items-center justify-center text-red-500 text-xl">
        {error}
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-500 text-white py-16 px-4 mb-6">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            🌸 Chào mừng bạn đến với Vườn Truyện Rực Rỡ
          </h1>
          <p className="text-md md:text-lg mb-6">
            Nơi hội tụ muôn vàn câu chuyện thăng hoa cảm xúc, dẫn lối bạn phiêu du qua những trang giấy ảo diệu.
          </p>
          <Link
            to="/the-loai"
            className="inline-block bg-white text-purple-700 hover:bg-purple-100 font-semibold px-6 py-3 rounded transition"
          >
            Khám phá kho truyện
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap -mx-4">
          {/* Main */}
          <div className="w-full lg:w-7/12 px-4">
            <section className="mb-12">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-blue-500 text-white p-2 rounded mr-2">
                  MỚI CẬP NHẬT
                </span>
                <span className="text-gray-700">Truyện mới nhất</span>
              </h2>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-6">
                {comics.map((item) => (
                  <Link
                    key={item._id}
                    to={`/truyen/${item.slug}`}
                    className="bg-white text-black rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={
                        item.thumb_url
                          ? `${cdnDomain}/uploads/comics/${item.thumb_url}`
                          : "/default-avatar.png"
                      }
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-1">
                      <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                      <p className="text-gray-500 text-xs">
                        {item.chaptersLatest && item.chaptersLatest.length > 0
                          ? `Mới nhất: ${item.chaptersLatest[0].chapter_name}`
                          : "Chưa có chương"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={goToPage}
              />
            </section>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-5/12 px-4">
          <h2 className="text-xl font-bold mb-4 flex items-center">
                <span className="bg-blue-500 text-white p-1 rounded mr-2">
                  Mộng Truyện
                </span>
                <span className="text-gray-700">Truyện của bạn</span>
              </h2>
              <div className="flex mb-6">
                {/* Lịch sử đọc */}
                <div className="w-1/2 pr-2">
                  <div className="bg-white rounded-lg shadow p-4 h-full">
                    <h3 className="font-bold text-lg mb-3 text-purple-700">
                      Lịch sử đọc
                    </h3>
                    {readingHistory.length === 0 ? (
                      <div className="text-xs text-gray-500">
                        Bạn chưa đọc truyện nào.
                      </div>
                    ) : (
                      <div className="space-y-2 text-xs text-gray-700">
                        {[...new Set(readingHistory.map((h) => h.slug))]
                          .slice(0, 5)
                          .map((slug) => {
                            const comic = historyComics[slug];
                            return (
                              <Link
                                key={slug}
                                to={`/truyen/${slug}`}
                                className="flex items-center gap-2 hover:bg-purple-50 p-2 rounded"
                              >
                                <img
                                  src={
                                    comic?.thumb_url
                                      ? `${cdnDomain}/uploads/comics/${comic.thumb_url}`
                                      : "/default-avatar.png"
                                  }
                                  alt={comic?.name}
                                  className="w-8 h-12 object-cover rounded border"
                                />
                                <span className="text-sm truncate">
                                  {comic?.name || slug}
                                </span>
                              </Link>
                            );
                          })}
                        {readingHistory.length > 5 && (
                          <Link
                            to="/profile"
                            className="block mt-2 text-xs font-semibold text-center text-purple-600 hover:underline"
                          >
                            Xem thêm...
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Truyện theo dõi */}
                <div className="w-1/2 pl-2">
                  <div className="bg-white rounded-lg shadow p-4 h-full">
                    <h3 className="font-bold text-lg mb-3 text-blue-700">
                      Truyện theo dõi
                    </h3>
                    {followedComics.length === 0 ? (
                      <p className="text-xs text-gray-500">
                        Bạn chưa theo dõi truyện nào.
                      </p>
                    ) : (
                      <div className="space-y-2 text-xs text-gray-700">
                        {followedComics.slice(0, 5).map((comic) => (
                          <Link
                            key={comic.slug}
                            to={`/truyen/${comic.slug}`}
                            className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                          >
                            <img
                              src={comic.thumb_url}
                              alt={comic.name}
                              className="w-8 h-12 object-cover rounded border"
                            />
                            <div className="flex-1 truncate">
                              <div className="font-medium text-sm truncate">
                                {comic.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                Chapter {comic.chap || "?"}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {followedComics.length > 5 && (
                          <Link
                            to="/profile"
                            className="block mt-2 text-xs font-semibold text-center text-purple-600 hover:underline"
                          >
                            Xem thêm...
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>


            {/* Top Ranking */}
            <div className="w-full mb-6">
              <TopRanking comics={comics} />
            </div>

            {/* Lịch */}
            <div>
              <CalendarWidget />
            </div>
          </div>
        </div>
        {/* Bình luận trang chủ */}
            <section className="mb-12 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6 text-purple-700 border-b-2 border-pink-200 pb-2">
                Bình luận trang chủ
              </h2>
              <HomeComments
                comments={homeComments}
                onAddComment={handleAddComment}
                user={user}
              />
            </section>
      </div>
    </div>
  );
};

export default Home;
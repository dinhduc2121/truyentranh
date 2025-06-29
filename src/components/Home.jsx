import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import TopRanking from "./TopRanking";
import { API_BASE_URL } from "../../config";

const Home = ({ selectedCategory, categories = [], onSelectCategory, user }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});

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
        setComics(data.data?.items || []);
        const pagination = data.data?.params?.pagination;
        const total = pagination
          ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
          : 1;
        setTotalPages(total);
        setLoading(false);
      })
      .catch((err) => {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:3001/api/user/history", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setReadingHistory(data.readingHistory || []));
  }, [user]);

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

  if (loading) return <div className="bg-[#222] min-h-screen flex items-center justify-center text-white text-xl">Đang tải...</div>;
  if (error) return <div className="bg-[#222] min-h-screen flex items-center justify-center text-red-500 text-xl">{error}</div>;

  const cdnDomain = "https://img.otruyenapi.com";

  const filteredComics = selectedCategory
    ? comics.filter((item) => item.category && item.category.some((cat) => cat.id === selectedCategory))
    : comics;

  const goToPage = (p) => {
    setSearchParams({ page: p });
  };

  return (
    <div className="min-h-screen bg-white font-sans text-black">
      <main className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-6">
        <div className="flex-1 min-w-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredComics.map((item, idx) => (
              <Link
                to={`/truyen/${item.slug}`}
                key={item._id || idx}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200 text-black block overflow-hidden border border-gray-300 hover:-translate-y-1 relative"
              >
                <div className="relative w-full aspect-[3/4] overflow-hidden">
                  <img
                    src={item.thumb_url ? `${cdnDomain}/uploads/comics/${item.thumb_url}` : "https://via.placeholder.com/150x220?text=No+Image"}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200 border-b border-gray-300"
                    loading="lazy"
                  />
                  {item.isHot && (
                    <span className="absolute top-2 right-2 bg-gradient-to-r from-[#ff512f] to-[#f09819] text-xs text-white font-bold px-2 py-0.5 rounded shadow">HOT</span>
                  )}
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <h3 className="text-base font-bold text-black group-hover:text-[#ffb300] line-clamp-2 min-h-[2.5em] leading-tight">{item.name}</h3>
                </div>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
              <button
                className="px-2 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
              >
                &lt;
              </button>
              {(() => {
                const maxShow = 2;
                const range = 1;
                let pages = [];
                for (let i = 1; i <= totalPages; i++) {
                  if (
                    i <= maxShow ||
                    i > totalPages - maxShow ||
                    (i >= page - range && i <= page + range)
                  ) {
                    pages.push(i);
                  } else if (
                    (i === maxShow + 1 && page - range > maxShow + 1) ||
                    (i === totalPages - maxShow && page + range < totalPages - maxShow)
                  ) {
                    pages.push("...");
                  }
                }
                return pages.reduce((arr, p, idx) => {
                  if (p === "..." && arr[arr.length - 1] === "...") return arr;
                  arr.push(p);
                  return arr;
                }, []).map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                  ) : (
                    <button
                      key={`pagination-page-${p}`}
                      className={`px-3 py-1 rounded border text-sm ${page === p ? "bg-[#ffb300] text-white" : "bg-gray-100 text-gray-700"}`}
                      onClick={() => goToPage(p)}
                    >
                      {p}
                    </button>
                  )
                );
              })()}
              <button
                className="px-2 py-1 rounded border text-sm bg-gray-200 hover:bg-gray-300"
                disabled={page >= totalPages}
                onClick={() => goToPage(page + 1)}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
        <aside className="w-full md:w-72 mt-8 md:mt-0 flex-shrink-0 flex flex-col gap-6">
          {user && (
            <div className="bg-white rounded shadow p-4">
              <div className="font-bold text-base mb-2 text-[#2196f3]">Lịch sử đọc truyện</div>
              {readingHistory.length === 0 ? (
                <div className="text-xs text-gray-500">Bạn chưa đọc truyện nào.</div>
              ) : (
                <ul className="text-xs text-gray-800 space-y-2">
                  {[...new Set(readingHistory.map(h => h.slug))].slice(0, 10).map((slug, idx) => {
                    const comic = historyComics[slug];
                    return (
                      <li key={slug} className="flex items-center gap-2">
                        <Link to={`/truyen/${slug}`}>
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
                        <Link to={`/truyen/${slug}`} className="font-semibold hover:underline text-sm line-clamp-1">
                          {comic?.name || slug}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
          <TopRanking comics={filteredComics} />
        </aside>
      </main>
    </div>
  );
};

export default Home;

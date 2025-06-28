import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Detail = ({ user }) => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readingHistory, setReadingHistory] = useState([]);
  const [historyComics, setHistoryComics] = useState({});
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
      .then(res => res.json())
      .then(data => {
        setComic(data.data?.item || null);
        setLoading(false);
      })
      .catch(() => {
        setError("Lỗi khi tải chi tiết truyện");
        setLoading(false);
      });
  }, [slug]);

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

  // Kiểm tra đã theo dõi truyện chưa
  useEffect(() => {
    if (!user?.token || !slug) return setIsFollowing(false);
    fetch(`http://localhost:3001/api/user/is-following/${slug}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => setIsFollowing(!!data.isFollowing))
      .catch(() => setIsFollowing(false));
  }, [user, slug]);

  // Xử lý theo dõi/bỏ theo dõi
  const handleFollow = async () => {
    if (!user?.token) return;
    setFollowLoading(true);
    const url = isFollowing
      ? "http://localhost:3001/api/user/unfollow"
      : "http://localhost:3001/api/user/follow";
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ slug })
    });
    setIsFollowing(f => !f);
    setFollowLoading(false);
  };

  if (loading) return <div className="p-4">Đang tải chi tiết truyện...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!comic) return <div className="p-4">Không tìm thấy truyện.</div>;

  const cdnDomain = "https://img.otruyenapi.com";
  const thumb = comic.thumb_url
    ? (comic.thumb_url.startsWith('http') ? comic.thumb_url : `${cdnDomain}/uploads/comics/${comic.thumb_url}`)
    : `${cdnDomain}/uploads/comics/no-image.png`;

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 bg-white text-black min-h-screen">
      <div className="flex-1">
        <div className="text-xs text-gray-500 mb-2">
          <Link to="/" className="hover:underline text-blue-700">Trang chủ</Link>
          {" » "}
          <Link to="/the-loai" className="hover:underline text-blue-700">Thể loại</Link>
          {" » "}
          <span className="font-semibold">{comic.name}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-6 bg-white rounded shadow p-4">
          <div>
            <img
              src={thumb}
              alt={comic.name}
              className="w-44 h-64 object-cover rounded shadow border"
              onError={e => { e.target.onerror = null; e.target.src = `${cdnDomain}/uploads/comics/no-image.png`; }}
            />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-[#222] mb-1">{comic.name}</h1>
            <div className="text-xs text-gray-500 mb-1">
              [Cập nhật lúc: {comic.updatedAt ? new Date(comic.updatedAt).toLocaleString() : "-"}]
            </div>
            <div className="flex flex-wrap gap-3 text-sm mb-1">
              <div><span className="font-semibold">Tác giả:</span> {Array.isArray(comic.author) ? comic.author.join(", ") : (comic.author || "Không rõ")}</div>
              <div><span className="font-semibold">Tình trạng:</span> {comic.status || "?"}</div>
              <div><span className="font-semibold">Thể loại:</span>{" "}
                {comic.category?.map((cat, i) => (
                  <Link
                    key={cat.id || cat.slug || i}
                    to={`/the-loai/${cat.slug}`}
                    className="text-blue-700 hover:underline mr-1"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div><span className="font-semibold">Lượt xem:</span> {comic.views?.toLocaleString() || 0}</div>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">Xếp hạng:</span>
              <span className="text-yellow-500 font-bold">{comic.rating || "?"}</span>
              <span className="text-xs text-gray-500">({comic.rate_count || 0} lượt đánh giá)</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <button
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  isFollowing
                    ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
                onClick={handleFollow}
                disabled={followLoading || !user}
              >
                {followLoading
                  ? "Đang xử lý..."
                  : isFollowing
                    ? "Đã theo dõi"
                    : "Theo dõi"}
              </button>
              <span className="text-[#ff4e8a] font-bold">{comic.followers?.toLocaleString() || "0"}</span>
              <span className="text-xs text-gray-500">Người Đã Theo Dõi</span>
            </div>
            <div className="flex gap-2 mb-2">
              <Link to={`/doc/${comic.slug}/${comic.chapters?.[0]?.server_data?.[0]?.chapter_name || ""}`} className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs font-semibold">Đọc từ đầu</Link>
              <Link to={`/doc/${comic.slug}/${comic.chapters?.[0]?.server_data?.[comic.chapters?.[0]?.server_data?.length - 1]?.chapter_name || ""}`} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-semibold">Đọc mới nhất</Link>
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 rounded text-xs font-semibold">Đọc tiếp &gt;</button>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Mô tả:</span>{" "}
              <span className="text-gray-800" dangerouslySetInnerHTML={{__html: comic.content || "Không có mô tả."}} />
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white rounded shadow p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-lg text-[#222]">Danh sách chương</span>
            <span className="text-xs text-gray-500">({comic.chapters?.[0]?.server_data?.length || 0} chương)</span>
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
                {comic.chapters && comic.chapters[0]?.server_data?.map((chap, idx) => (
                  <tr key={chap.chapter_name || idx} className="border-b hover:bg-gray-50">
                    <td className="py-1 px-2">
                      <Link
                        to={`/doc/${comic.slug}/${encodeURIComponent(chap.chapter_name)}`}
                        className="text-blue-700 hover:underline"
                      >
                        Chapter {chap.chapter_name}
                      </Link>
                    </td>
                    <td className="py-1 px-2 text-gray-500">{chap.time || "-"}</td>
                    <td className="py-1 px-2">
                      {user && isChapterRead(comic.slug, chap.chapter_name) && (
                        <span className="text-green-600 text-xs font-semibold">Đã đọc</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="w-full md:w-80 flex-shrink-0 mt-8 md:mt-0">
        <div className="bg-white border rounded shadow p-4 mb-6">
          <div className="font-bold text-base mb-2 text-[#2196f3]">Lịch sử đọc truyện</div>
          {user ? (
            readingHistory.length === 0 ? (
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
            )
          ) : (
            <div className="text-xs text-gray-500">Đăng nhập để lưu lịch sử đọc truyện.</div>
          )}
        </div>
        <div className="bg-white border rounded shadow p-4">
          <div className="flex border-b mb-2">
            <button className="flex-1 py-1 text-xs font-bold border-b-2 border-[#ffb300] text-[#ffb300]">Top Tháng</button>
            <button className="flex-1 py-1 text-xs font-bold border-b-2 border-transparent text-gray-700">Top Tuần</button>
            <button className="flex-1 py-1 text-xs font-bold border-b-2 border-transparent text-gray-700">Top Ngày</button>
          </div>
          <ul>
            <li className="flex items-center gap-2 py-2 border-b last:border-b-0">
              <span className="text-lg font-bold text-[#ffb300] w-6 text-center">01</span>
              <div className="w-10 h-14 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="font-semibold text-xs text-[#2b1e4a] line-clamp-1">Bách Luyện Thành Thần</div>
                <div className="text-xs text-gray-500">Chapter 1295</div>
              </div>
              <span className="text-xs text-gray-400">41M</span>
            </li>
            {/* ...Thêm các mục top khác nếu muốn... */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Detail;

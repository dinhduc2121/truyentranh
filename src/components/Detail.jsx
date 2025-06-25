import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Detail = () => {
  const { slug } = useParams();
  const [comic, setComic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <div className="p-4">Đang tải chi tiết truyện...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!comic) return <div className="p-4">Không tìm thấy truyện.</div>;

  const cdnDomain = "https://img.otruyenapi.com";

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={comic.thumb_url ? (comic.thumb_url.startsWith('http') ? comic.thumb_url : `${cdnDomain}/uploads/comics/${comic.thumb_url}`) : `${cdnDomain}/uploads/comics/no-image.png`}
          alt={comic.name}
          className="w-44 h-64 object-cover rounded shadow"
          onError={e => { e.target.onerror = null; e.target.src = `${cdnDomain}/uploads/comics/no-image.png`; }}
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2 text-yellow-300">{comic.name}</h1>
          <div className="flex flex-wrap gap-2 mb-2">
            {comic.category?.map(cat => (
              <span key={cat.id || cat.slug} className="text-xs bg-indigo-100 text-indigo-700 rounded px-2 py-0.5">{cat.name}</span>
            ))}
          </div>
          <div className="mb-2 text-sm text-gray-300">Tác giả: {Array.isArray(comic.author) ? comic.author.join(", ") : (comic.author || "Không rõ")}</div>
          <div className="mb-2 text-sm text-gray-300">Trạng thái: {comic.status || "?"}</div>
          <div className="mb-2 text-sm text-gray-300">Lượt xem: {comic.views || 0}</div>
          <div className="mb-2 text-sm text-gray-300">Cập nhật: {comic.updatedAt ? new Date(comic.updatedAt).toLocaleString() : "-"}</div>
          <div className="mb-2 text-sm text-gray-300">Mô tả: <span className="text-white" dangerouslySetInnerHTML={{__html: comic.content || "Không có mô tả."}} /></div>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Danh sách chương</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {comic.chapters && comic.chapters[0]?.server_data?.map(chap => (
            <Link
              to={`/doc/${comic.slug}/${encodeURIComponent(chap.chapter_name)}`}
              key={chap.chapter_name}
              className="bg-indigo-600 hover:bg-yellow-300 hover:text-black text-white rounded px-2 py-1 text-sm text-center transition"
            >
              Chương {chap.chapter_name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Detail;

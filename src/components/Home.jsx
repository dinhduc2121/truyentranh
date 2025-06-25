import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = ({ selectedCategory }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://otruyenapi.com/v1/api/home")
      .then((res) => res.json())
      .then((data) => {
        setComics(data.data?.items || []);
        setLoading(false);
      })
      .catch((err) => {
        setError("Lỗi khi tải dữ liệu");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>{error}</div>;

  const cdnDomain = "https://img.otruyenapi.com";

  // Lọc truyện theo thể loại nếu có chọn
  const filteredComics = selectedCategory
    ? comics.filter((item) => item.category && item.category.some((cat) => cat.id === selectedCategory))
    : comics;

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredComics.map((item, idx) => (
          <Link to={`/truyen/${item.slug}`} key={item._id || idx} className="bg-white rounded shadow p-2 hover:shadow-lg transition text-black block">
            <img
              src={item.thumb_url ? `${cdnDomain}/uploads/comics/${item.thumb_url}` : "https://via.placeholder.com/150x220?text=No+Image"}
              alt={item.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="mt-2 text-sm font-semibold line-clamp-2">{item.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.category?.map((cat) => (
                <span key={cat.id} className="text-xs bg-indigo-100 text-indigo-700 rounded px-2 py-0.5">{cat.name}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;

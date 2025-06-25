import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const Read = () => {
  const { slug, chapter } = useParams();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
      .then(res => res.json())
      .then(data => {
        const comic = data.data?.item;
        console.log('Truyện:', comic);

        if (!comic || !comic.chapters) throw new Error("Không tìm thấy truyện hoặc chương");

        let chapterObj = null;
        const chapterParam = decodeURIComponent(chapter).replace(/\s+/g, " ").trim().toLowerCase();
        console.log('chapter param:', chapterParam);

        for (const server of comic.chapters) {
          chapterObj = server.server_data.find(c =>
            c.chapter_name.replace(/\s+/g, " ").trim().toLowerCase() === chapterParam
          );
          if (chapterObj) break;
        }

        console.log('chapterObj:', chapterObj);
        if (!chapterObj) throw new Error("Không tìm thấy chương này");

        return fetch(chapterObj.chapter_api_data)
          .then(res => res.json())
          .then(chapData => {
            console.log('chapData full:', chapData);
            const domain = chapData.data?.domain_cdn;
            const path = chapData.data?.item?.chapter_path;
            const files = chapData.data?.item?.chapter_image ?? [];

            const imgs = files.map(f => `${domain}/${path}/${f.image_file}`);
            console.log('Resolved images:', imgs);
            setImages(imgs);
            setLoading(false);
          });
      })
      .catch((e) => {
        setError("Lỗi khi tải chương truyện");
        setLoading(false);
        console.error(e);
      });
  }, [slug, chapter]);

  if (loading) return <div className="p-4">Đang tải chương...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex flex-col gap-4 items-center">
        {images.length > 0 ? images.map((img, idx) => (
          <img
            key={idx}
            src={img}
            alt={`Trang ${idx + 1}`}
            className="w-full rounded shadow"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        )) : <div className="text-gray-400">Không có ảnh chương này.</div>}
      </div>
      <div className="mt-6 text-center">
        <Link to={`/truyen/${slug}`} className="text-indigo-400 hover:underline">
          ← Quay lại chi tiết truyện
        </Link>
      </div>
    </div>
  );
};

export default Read;

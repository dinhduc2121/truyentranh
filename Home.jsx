import React, { useEffect, useState } from "react";

const slides = [
  {
    title: "ONE PIECE",
    description: "Cuộc phiêu lưu của Luffy và đồng đội trên biển khơi...",
    image: "https://placehold.co/1600x400",
  },
  {
    title: "NARUTO",
    description: "Hành trình trở thành Hokage của Naruto Uzumaki...",
    image: "https://placehold.co/1600x400",
  },
  {
    title: "DRAGON BALL",
    description: "Những trận chiến kịch tính của Goku chống lại các sức mạnh vũ trụ...",
    image: "https://placehold.co/1600x400",
  },
];

const Home = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("day");

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Slider */}
      <div className="relative h-[400px] overflow-hidden">
        {slides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === activeSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
              <h2 className="text-2xl font-bold">{slide.title}</h2>
              <p className="text-sm mt-1">{slide.description}</p>
              <button className="mt-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded">
                Đọc ngay
              </button>
            </div>
          </div>
        ))}
        {/* Dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx === activeSlide ? "bg-white opacity-100" : "bg-white opacity-50"
              }`}
              onClick={() => setActiveSlide(idx)}
            />
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap -mx-4">
        {/* Main content */}
        <div className="w-full lg:w-7/12 px-4">
          {/* Mới cập nhật */}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-500 text-white p-2 rounded mr-2">MỚI CẬP NHẬT</span>
              <span className="text-gray-700">Truyện mới nhất</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                "Attack on Titan",
                "Tokyo Revengers",
                "One Punch Man",
                "Naruto",
                "Dragon Ball",
              ].map((name, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <img
                    src="https://placehold.co/300x200"
                    alt={name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm truncate">{name}</h3>
                    <p className="text-gray-500 text-xs mt-1">Chapter {100 + idx}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-400">{idx + 1} giờ trước</span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Mới
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {Array.from({ length: 3 }, (_, i) => (
                <button
                  key={i}
                  className={`px-3 py-1 rounded border text-sm ${
                    i === 0
                      ? "bg-[#ffb300] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </section>

          {/* Bình luận mới */}
          <section>
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              Bình luận mới nhất
            </h2>
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="bg-white p-4 rounded shadow border-l-4 border-transparent hover:border-purple-600 hover:bg-purple-50 transition"
                >
                  <div className="flex items-start">
                    <img
                      src="https://placehold.co/50x50"
                      className="w-10 h-10 rounded-full mr-3"
                      alt="User"
                    />
                    <div>
                      <div className="flex justify-between">
                        <h4 className="font-semibold">Người Dùng {n}</h4>
                        <span className="text-xs text-gray-500">{n} giờ trước</span>
                      </div>
                      <p className="text-sm mt-1">
                        Đây là bình luận số {n}, rất hay và đáng đọc.
                      </p>
                      <div className="flex items-center mt-2 text-sm">
                        <span className="text-gray-500">Tác phẩm: One Piece</span>
                        <span className="mx-2">•</span>
                        <span className="text-green-500">Chapter 1045</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-5/12 px-4 mt-8 lg:mt-0 flex flex-col gap-6">
          {/* Lịch sử + Theo dõi song song */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Lịch sử */}
            <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
              <h3 className="font-bold text-lg mb-3 text-purple-700">Lịch sử đọc truyện</h3>
              <div className="space-y-3">
                {["One Punch Man", "Demon Slayer"].map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-2 rounded hover:bg-purple-50 cursor-pointer"
                  >
                    <img
                      src="https://placehold.co/60x80"
                      className="w-12 h-16 object-cover rounded mr-3"
                      alt={name}
                    />
                    <div>
                      <h4 className="text-sm font-medium">{name}</h4>
                      <p className="text-xs text-gray-500">Chapter {150 + idx}</p>
                      <p className="text-xs text-gray-400 mt-1">{(idx + 1) * 30} phút trước</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Theo dõi */}
            <div className="w-full md:w-1/2 bg-white rounded shadow p-4">
              <h3 className="font-bold text-lg mb-3 text-blue-700">Truyện theo dõi</h3>
              <div className="space-y-3">
                {["Jujutsu Kaisen", "Chainsaw Man"].map((name, idx) => (
                  <div
                    key={idx}
                    className="flex items-center p-2 rounded hover:bg-blue-50 cursor-pointer"
                  >
                    <img
                      src="https://placehold.co/60x80"
                      className="w-12 h-16 object-cover rounded mr-3"
                      alt={name}
                    />
                    <div>
                      <h4 className="text-sm font-medium">{name}</h4>
                      <p className="text-xs text-gray-500">Chapter mới: {100 + idx}</p>
                      {idx === 0 && (
                        <span className="text-xs bg-red-100 text-red-800 px-1 rounded mt-1 inline-block">
                          Có mới
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top truyện */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-bold text-lg mb-3 text-red-700">Top truyện</h3>
            <div className="flex mb-4 border-b pb-2">
              {["day", "week", "month"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeTab === tab
                      ? "text-red-600 border-b-2 border-red-600"
                      : "text-gray-500"
                  }`}
                >
                  {tab === "day"
                    ? "Ngày"
                    : tab === "week"
                    ? "Tuần"
                    : "Tháng"}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className="flex items-center p-2 rounded hover:bg-red-50"
                >
                  <span className="text-red-600 font-bold mr-3">{n}</span>
                  <img
                    src="https://placehold.co/40x50"
                    className="w-10 h-12 object-cover rounded mr-3"
                    alt=""
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">One Piece</h4>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Chapter 1045</span>
                      <span>{n * 1000} lượt xem</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bình luận hot */}
          <div className="bg-white rounded shadow p-4">
            <h3 className="font-bold text-lg mb-3 text-orange-700">Bình luận hot</h3>
            {[1, 2].map((n) => (
              <div
                key={n}
                className="flex items-start p-3 bg-orange-50 rounded mb-2"
              >
                <div className="text-center mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-500 mx-auto"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                    />
                  </svg>
                  <span className="text-xs font-bold text-orange-500">{n * 500}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    Bình luận hot {n}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Nội dung bình luận rất thú vị và thu hút.
                  </p>
                  <div className="flex items-center mt-2 text-xs">
                    <span className="text-gray-500">Bởi: User {n}</span>
                    <span className="mx-2">•</span>
                    <span className="text-gray-500">One Piece</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ChapterNav from "./ChapterNav";
import ChapterList from "./ChapterList";
import ChapterImages from "./ChapterImages";
import RaiTing from "../RaiTing";
import CommentSection from "../CommentSection";
import { useFollowStatus } from "./hooks/useFollowStatus";
import { useChapterData } from "./hooks/useChapterData";
import { useReadingHistory } from "./hooks/useReadingHistory";
import { useFollowedComics } from "./hooks/useFollowedComics";

const Read = ({ user }) => {
  const { slug, chapter } = useParams();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const chapterListRef = useRef(null);
  const [historyComics, setHistoryComics] = useState({});

  const {
    comicName,
    updatedAt,
    allChapters,
    currentChapterIdx,
    images,
    loading: imgLoading,
    error: imgError,
  } = useChapterData(slug, chapter);

  const { isFollowing, toggleFollow } = useFollowStatus({ user, slug });
  const { readingHistory } = useReadingHistory({ user, slug, chapter });
  const { followedComics, loading: followLoading, error: followError } = useFollowedComics({ user });

  const cdnDomain = "https://img.otruyenapi.com";

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

  const goToChapter = (idx) => {
    if (idx >= 0 && idx < allChapters.length) {
      const chap = allChapters[idx];
      navigate(`/doc/${slug}/${encodeURIComponent(chap.chapter_name)}`);
      setShowChapterList(false);
    }
  };

  const prevIdx = currentChapterIdx + 1 < allChapters.length ? currentChapterIdx + 1 : -1;
  const nextIdx = currentChapterIdx - 1 >= 0 ? currentChapterIdx - 1 : -1;

  return (
    <div className="min-h-screen bg-white text-gray-800 py-4 font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 w-64 bg-white text-black shadow transform transition-transform duration-300 z-30 border-r ${
          showSidebar ? "translate-x-0" : "-translate-x-full"
        } flex flex-col h-screen`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Thông tin</h2>
          <button
            onClick={() => setShowSidebar(false)}
            className="text-gray-500 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        {/* Nội dung scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-6 text-sm">
          {/* Lịch sử đọc */}
          <div>
            <h3 className="font-bold mb-3 text-purple-700">Lịch sử đọc</h3>
            {user && readingHistory?.length > 0 ? (
              <div className="space-y-2">
                {[...new Set(readingHistory.map((h) => h.slug))]
                  .slice(0, 5)
                  .map((slug) => {
                    const comic = historyComics[slug];
                    return (
                      <Link
                        key={slug}
                        to={`/truyen/${slug}`}
                        onClick={() => setShowSidebar(false)}
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
                        <span className="truncate">{comic?.name || slug}</span>
                      </Link>
                    );
                  })}
                {readingHistory.length > 5 && (
                  <Link
                    to="/profile"
                    onClick={() => setShowSidebar(false)}
                    className="block mt-2 text-xs font-semibold text-center text-purple-600 hover:underline"
                  >
                    Xem thêm...
                  </Link>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">Chưa có dữ liệu lưu dấu kỷ niệm.</p>
            )}
          </div>

          {/* Truyện theo dõi */}
          <div>
            <h3 className="font-bold mb-3 text-blue-700">Truyện theo dõi</h3>
            {user ? (
              followLoading ? (
                <p className="text-gray-500">Đang tải hơi thở ngọt ngào...</p>
              ) : followError ? (
                <p className="text-red-500">{followError}</p>
              ) : followedComics.length > 0 ? (
                <div className="space-y-2">
                  {followedComics.slice(0, 5).map((comic) => (
                    <Link
                      key={comic.slug}
                      to={`/truyen/${comic.slug}`}
                      onClick={() => setShowSidebar(false)}
                      className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded"
                    >
                      <img
                        src={comic.thumb_url}
                        alt={comic.name}
                        className="w-8 h-12 object-cover rounded border"
                      />
                      <div className="truncate">
                        <div className="font-medium truncate">{comic.name}</div>
                        <div className="text-xs text-gray-500">
                          Chapter {comic.chap || "?"}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {followedComics.length > 5 && (
                    <Link
                      to="/profile"
                      onClick={() => setShowSidebar(false)}
                      className="block mt-2 text-xs font-semibold text-center text-purple-600 hover:underline"
                    >
                      Xem thêm...
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 italic">Chưa cất giữ bóng hình truyện nào.</p>
              )
            ) : (
              <p className="text-gray-500">Đăng nhập để dệt nên hồi ức.</p>
            )}
          </div>

          {/* Đánh giá */}
          <div>
            <h3 className="font-bold mb-3">Đánh giá truyện</h3>
            <RaiTing comicSlug={slug} user={user} />
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black bg-opacity-30 z-20"
        ></div>
      )}

      {/* Main */}
      <main className="max-w-4xl mx-auto space-y-6 pb-20">
        <nav className="text-xs text-gray-500 mb-2 px-2">
          <Link to="/" className="hover:underline text-blue-500">Trang Chủ</Link>
          {" / "}
          <Link to={`/truyen/${slug}`} className="hover:underline text-blue-500">{comicName}</Link>
          {" / "}
          <span>Chương {chapter}</span>
        </nav>

        <div className="bg-white p-4 border border-gray-200 rounded shadow text-sm">
          <h1 className="text-lg font-semibold mb-2">
            {comicName} - Chapter {chapter}
            <span className="text-xs text-gray-500 ml-2">(Cập nhật: {updatedAt || "?"})</span>
          </h1>
          <p className="mb-2">
            Nếu không xem được truyện vui lòng đổi <strong>"SERVER HÌNH"</strong> bên dưới.
          </p>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded">Server 1</button>
            <button className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded">Server VIP</button>
            <button className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded">⚠ Báo Lỗi Chương</button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg shadow p-4 border border-gray-200">
          <ChapterImages images={images} loading={imgLoading} error={imgError} />
        </div>

        <div className="bg-gray-50 text-gray-800 rounded-lg shadow p-4 border border-gray-200">
          <h3 className="font-medium mb-2">Bình luận</h3>
          <CommentSection comicSlug={slug} user={user} />
        </div>
      </main>

      {/* ChapterNav */}
      <ChapterNav
        allChapters={allChapters}
        currentChapterIdx={currentChapterIdx}
        prevIdx={prevIdx}
        nextIdx={nextIdx}
        goToChapter={goToChapter}
        showChapterList={showChapterList}
        setShowChapterList={setShowChapterList}
        renderChapterList={() => (
          <ChapterList
            ref={chapterListRef}
            allChapters={allChapters}
            currentChapterIdx={currentChapterIdx}
            goToChapter={goToChapter}
            isChapterRead={(s, c) => false}
            slug={slug}
            user={user}
          />
        )}
        isFollowing={isFollowing}
        toggleFollow={toggleFollow}
        onToggleSidebar={() => setShowSidebar(true)}
        className="!fixed !bottom-0 !left-0 !w-full"
      />
    </div>
  );
};

export default Read;

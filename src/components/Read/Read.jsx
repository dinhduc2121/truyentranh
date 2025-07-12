import React, { useRef, useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ChapterNav from "./ChapterNav";
import ChapterList from "./ChapterList";
import ChapterImages from "./ChapterImages";
import CommentSection from "../CommentSection";
import { useFollowStatus } from "./hooks/useFollowStatus";
import { useChapterData } from "./hooks/useChapterData";
import { useReadingHistory } from "./hooks/useReadingHistory";
import { useFollowedComics } from "./hooks/useFollowedComics";

const Read = ({ user }) => {
  const { slug, chapter } = useParams();
  const navigate = useNavigate();
  const [showChapterList, setShowChapterList] = useState(false);
  const chapterListRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
  const { readingHistory, isChapterRead } = useReadingHistory({ user, slug, chapter });
  const { followedComics, loading: followLoading, error: followError } = useFollowedComics({ user });

  const goToChapter = (idx) => {
    if (idx >= 0 && idx < allChapters.length) {
      const chap = allChapters[idx];
      navigate(`/doc/${slug}/${encodeURIComponent(chap.chapter_name)}`);
      setShowChapterList(false);
    }
  };

  const renderChapterList = () => (
    <ChapterList
      ref={chapterListRef}
      allChapters={allChapters}
      currentChapterIdx={currentChapterIdx}
      goToChapter={goToChapter}
      isChapterRead={isChapterRead}
      slug={slug}
      user={user}
    />
  );

  const prevIdx = currentChapterIdx + 1 < allChapters.length ? currentChapterIdx + 1 : -1;
  const nextIdx = currentChapterIdx - 1 >= 0 ? currentChapterIdx - 1 : -1;

  useEffect(() => {
    if (!showChapterList) return;
    const handleClick = (e) => {
      if (chapterListRef.current && !chapterListRef.current.contains(e.target)) {
        setShowChapterList(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showChapterList]);

  useEffect(() => {
    const container = document.querySelector(".reader-container");
    if (!container) return;

    const handleScroll = () => {
      setShowScrollTop(container.scrollTop > 200);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const historyList = Array.isArray(readingHistory) ? readingHistory.slice(0, 2) : [];
  const hasMoreHistory = Array.isArray(readingHistory) && readingHistory.length > 2;

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Reader Section */}
      <div
        className="relative flex-[1] reader-container bg-white px-4 py-6 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        {/* Breadcrumb + Title */}
        <div className="mb-2">
          <div className="text-xs text-gray-500 mb-1">
            <Link to="/" className="hover:underline text-[#2196f3] font-medium">Trang chủ</Link>
            <span> » </span>
            <Link to="/the-loai" className="hover:underline text-[#2196f3] font-medium">Thể loại</Link>
            <span> » </span>
            <Link to={`/truyen/${slug}`} className="hover:underline text-[#2196f3] font-medium">{comicName}</Link>
            <span> » </span>
            <span className="font-semibold text-[#2196f3]">
              Chapter {allChapters[currentChapterIdx]?.chapter_name || chapter}
            </span>
            {updatedAt && (
              <span className="ml-2 text-gray-500 text-xs">
                [Cập nhật: {new Date(updatedAt).toLocaleString()}]
              </span>
            )}
          </div>
          <div className="reader-title text-2xl font-bold text-center">{comicName}</div>
        </div>

        {/* Chapter Navigation */}
        <div>
          <ChapterNav
            slug={slug}
            allChapters={allChapters}
            currentChapterIdx={currentChapterIdx}
            prevIdx={prevIdx}
            nextIdx={nextIdx}
            goToChapter={goToChapter}
            showChapterList={showChapterList}
            setShowChapterList={setShowChapterList}
            renderChapterList={renderChapterList}
            isFollowing={isFollowing}
            toggleFollow={toggleFollow}
          />
        </div>

        {/* Manga Images */}
        <div className="manga-page flex-1 flex justify-center items-center my-4">
          <ChapterImages images={images} loading={imgLoading} error={imgError} />
        </div>
      </div>

      {/* Sidebar Section */}
      <aside
        className="sidebar w-full max-w-[390px] border-l border-gray-200 bg-white flex flex-col gap-6 p-4 overflow-y-auto"
        style={{ maxHeight: "100vh" }}
      >
        {/* Reading History and Followed Comics */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Reading History */}
          <div className="sidebar-section flex-1">
            <h3 className="section-title text-[#2196f3] font-bold mb-3">Lịch sử đọc</h3>
            {user && historyList.length > 0 ? (
              <>
                {historyList.map((item, idx) => (
                  <div key={idx} className="history-item mb-4 cursor-pointer">
                    <Link to={`/truyen/${item.slug}`}>
                      <img
                        src={
                          item.thumb_url?.startsWith("http")
                            ? item.thumb_url
                            : `https://img.otruyenapi.com/uploads/comics/${item.thumb_url || "placeholder.jpg"}`
                        }
                        alt={item.name || item.slug}
                        className="w-full h-36 object-cover rounded mb-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://placehold.co/120x180?text=No+Img";
                        }}
                      />
                      <div className="item-info text-center">
                        <div className="item-title font-semibold">{item.name || item.slug}</div>
                        <div className="item-chapter text-xs text-gray-500">Chương {item.chapter}</div>
                      </div>
                    </Link>
                  </div>
                ))}
                {hasMoreHistory && (
                  <div className="text-center text-gray-400 text-xs font-semibold">
                    <Link to="/Profile" className="hover:underline">Xem thêm</Link>
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-gray-500">Bạn chưa đọc truyện nào.</div>
            )}
          </div>

          {/* Vertical Divider */}
          <div className="hidden md:block border-l border-gray-300"></div>

          {/* Followed Comics */}
          <div className="sidebar-section flex-1">
            <h3 className="section-title text-[#ffb300] font-bold mb-3">Truyện theo dõi</h3>
            {user ? (
              followLoading ? (
                <div className="text-xs text-gray-500">Đang tải...</div>
              ) : followError ? (
                <div className="text-xs text-red-500">{followError}</div>
              ) : followedComics.length > 0 ? (
                <>
                  {followedComics.slice(0, 2).map((item, idx) => (
                    <div key={idx} className="followed-item mb-4 cursor-pointer">
                      <Link to={`/truyen/${item.slug}`}>
                        <img
                          src={
                            item.thumb_url?.startsWith("http")
                              ? item.thumb_url
                              : `https://img.otruyenapi.com/uploads/comics/${item.thumb_url || "placeholder.jpg"}`
                          }
                          alt={item.name || item.slug}
                          className="w-full h-36 object-cover rounded mb-2"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://placehold.co/120x180?text=No+Img";
                          }}
                        />
                        <div className="item-info text-center">
                          <div className="item-title font-semibold">{item.name}</div>
                        </div>
                      </Link>
                    </div>
                  ))}
                  {followedComics.length > 2 && (
                    <div className="text-center text-gray-400 text-xs font-semibold">
                      <Link to="/Profile" className="hover:underline">Xem thêm</Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-500">Bạn chưa theo dõi truyện nào.</div>
              )
            ) : (
              <div className="text-xs text-gray-500">Vui lòng đăng nhập để xem truyện theo dõi.</div>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="sidebar-section flex-1 min-h-[200px]">
          <h3 className="section-title text-[#2196f3] font-bold mb-3">Bình luận</h3>
          <div className="comments-container">
            <CommentSection comicSlug={slug} user={user} />
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Read;

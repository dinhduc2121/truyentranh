import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const CommentSection = ({ comicSlug, user }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3001';

  const fetchComments = async () => {
    if (!comicSlug) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/comment?comicSlug=${comicSlug}`);
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
      setError(null);
    } catch (err) {
      console.error('Lỗi khi tải bình luận:', err);
      setError('Lỗi khi tải bình luận');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [comicSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) {
      setError('Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!content.trim()) {
      setError('Nội dung bình luận không được để trống');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/api/comment`,
        { comicSlug, content },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setContent('');
      setError(null);
      fetchComments();
    } catch (err) {
      console.error('Lỗi khi gửi bình luận:', err);
      setError('Lỗi khi gửi bình luận');
    }
  };

  const handleLike = async (commentId) => {
    if (!user?.token) {
      alert("Vui lòng đăng nhập để thích bình luận");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/api/comment/like/${commentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      fetchComments();
    } catch (err) {
      console.error('Lỗi khi thích bình luận:', err);
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] text-gray-800 p-8 mt-10 rounded-md shadow-md">
      <h2 className="text-2xl font-bold text-[#3b82f6] mb-6 tracking-wide">
        Bình luận
      </h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hãy để lại vài lời dịu dàng..."
            className="w-full p-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] resize-y min-h-[120px]"
            maxLength={500}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-3 px-5 py-2 bg-[#3b82f6] text-white font-medium rounded-lg hover:bg-[#2563eb] transition-colors"
          >
            Gửi bình luận
          </button>
        </form>
      ) : (
        <p className="text-gray-600 mb-6">
          Vui lòng{" "}
          <Link to="/login" className="text-[#3b82f6] hover:underline">
            đăng nhập
          </Link>{" "}
          để tham gia chia sẻ.
        </p>
      )}

      {loading && <p className="text-gray-500">Đang tải bình luận...</p>}
      {!loading && comments.length === 0 && (
        <p className="text-gray-500 italic">Chưa có ai mở lời...</p>
      )}

      {!loading && comments.length > 0 && (
        <ul className="space-y-6">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`border-b border-gray-300 pb-4 ${
                c.isPinned ? 'bg-yellow-50 rounded-md px-2 py-2' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <img
                  src={c.User?.avatarUrl || "https://placehold.co/40x40?text=User"}
                  alt={c.displayName || c.User?.username || "Ẩn danh"}
                  className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/40x40?text=User";
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        c.User?.role === 'admin' ? 'text-red-500' : 'text-gray-800'
                      }`}
                    >
                      {c.displayName || c.User?.username || 'Ẩn danh'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                    {c.isPinned && (
                      <span className="ml-2 text-xs bg-yellow-300 text-black px-2 rounded-full font-semibold">
                        Được ghim
                      </span>
                    )}
                  </div>
                  <p className="text-gray-700 mt-2">{c.content}</p>
                  <div className="text-xs text-gray-500 mt-2 flex gap-4 items-center">
                    <button
                      onClick={() => handleLike(c.id)}
                      className="hover:text-[#f59e0b] transition-colors duration-200"
                      title="Thích"
                    >
                      👍 {c.likeCount || 0}
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CommentSection;

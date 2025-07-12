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
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/comment?comicSlug=${comicSlug}`);
      setComments(res.data.comments || []);
    } catch (err) {
      setError('Lỗi khi tải bình luận');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [comicSlug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.token) return setError('Vui lòng đăng nhập để bình luận');
    if (!content.trim()) return setError('Nội dung bình luận không được để trống');

    try {
      await axios.post(`${API_BASE_URL}/api/comment`, { comicSlug, content }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setContent('');
      setError(null);
      fetchComments();
    } catch (err) {
      setError('Lỗi khi gửi bình luận');
    }
  };

  const handleLike = async (commentId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/comment/like/${commentId}`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      fetchComments();
    } catch (err) {
      console.error("Lỗi like:", err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-[#2196f3] mb-4">Bình luận</h2>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ffb300] text-black resize-y min-h-[100px]"
            maxLength={500}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-[#ffb300] text-white rounded-lg hover:bg-[#e0a800] transition-colors"
          >
            Gửi bình luận
          </button>
        </form>
      ) : (
        <p className="text-gray-500 mb-6">
          Vui lòng <Link to="/login" className="text-[#ffb300] hover:underline">đăng nhập</Link> để bình luận.
        </p>
      )}

      {loading && <p className="text-gray-500">Đang tải bình luận...</p>}
      {!loading && comments.length === 0 && <p className="text-gray-500">Chưa có bình luận nào.</p>}

      {!loading && comments.length > 0 && (
        <ul className="space-y-4">
          {comments.map((c) => (
            <li
              key={c.id}
              className={`border-b border-gray-200 pb-4 ${c.isPinned ? 'bg-yellow-50 rounded-md px-2 py-2' : ''}`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={c.User?.avatarUrl || "https://placehold.co/40x40?text=User"}
                  alt={c.displayName || c.User?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-black ${c.User?.role === 'admin' ? 'text-red-600' : ''}`}>
                      {c.displayName || c.User?.username}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                    {c.isPinned && (
                      <span className="ml-2 text-xs bg-yellow-400 text-white px-2 rounded-full font-semibold">Được ghim</span>
                    )}
                  </div>
                  <p className="text-gray-800 mt-1">{c.content}</p>
                  <div className="text-xs text-gray-500 mt-2 flex gap-3 items-center">
                    <button
                      onClick={() => handleLike(c.id)}
                      className="hover:text-[#ff5722] transition"
                      title="Thích"
                    >
                      👍 {c.likeCount}
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

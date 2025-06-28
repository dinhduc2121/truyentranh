import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CommentSection = ({ comicSlug, user }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base URL for backend API
  const API_BASE_URL = 'http://localhost:3001';

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/comment?comicSlug=${comicSlug}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setComments(res.data.comments || []);
      } catch (err) {
        setError('Lỗi khi tải bình luận');
      }
      setLoading(false);
    };
    fetchComments();
  }, [comicSlug, user]);

  // Handle comment submission
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
      const res = await axios.post(
        `${API_BASE_URL}/api/comment`,
        { comicSlug, content },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setComments([res.data.comment, ...comments]);
      setContent('');
      setError(null);
    } catch (err) {
      setError('Lỗi khi gửi bình luận');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold text-[#2196f3] mb-4">Bình luận</h2>

      {/* Comment form */}
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

      {/* Comment list */}
      {loading && <p className="text-gray-500">Đang tải bình luận...</p>}
      {!loading && comments.length === 0 && <p className="text-gray-500">Chưa có bình luận nào.</p>}
      {!loading && comments.length > 0 && (
        <ul className="space-y-4">
          {comments.map((comment) => (
            <li key={comment._id} className="border-b border-gray-200 pb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <img
                    src="https://via.placeholder.com/40?text=User"
                    alt={comment.username}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-black">{comment.username}</span>
                    <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-gray-800 mt-1">{comment.content}</p>
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
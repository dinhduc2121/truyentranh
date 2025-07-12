import React, { useEffect, useState } from "react";
import "../../../src/index.css";

const HomeComments = ({ comments = [], onAddComment, user }) => {
  const [content, setContent] = useState("");
  const [allComments, setAllComments] = useState(comments);

  useEffect(() => {
    if (!Array.isArray(comments)) {
      setAllComments([]);
      return;
    }
    setAllComments(comments);
  }, [comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const newComment = await onAddComment(content);
      setAllComments((prev) => [newComment, ...prev]);
      setContent("");
    } catch (err) {
      console.error("Lỗi gửi bình luận:", err);
      alert("Gửi bình luận thất bại!");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="comment-textarea"
          rows={4}
          placeholder="Hãy chia sẻ cảm nghĩ của bạn..."
        />
        <button
          type="submit"
          className="comment-button"
        >
          Gửi bình luận
        </button>
      </form>

      {allComments.length === 0 ? (
        <p className="text-sm text-gray-500 italic">Chưa có bình luận nào.</p>
      ) : (
        allComments
          .filter((c) => c && typeof c === "object")
          .map((comment) => (
            <div
              key={comment.id || Math.random()}
              className="comment-box"
            >
              <div className="flex items-start gap-4">
                <img
                  src={
                    comment.User?.avatarUrl && comment.User.avatarUrl !== ""
                      ? comment.User.avatarUrl
                      : "https://placehold.co/48x48?text=User"
                  }
                  alt={comment.User?.username || "Ẩn danh"}
                  className="comment-avatar"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/48x48?text=User";
                  }}
                />

                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4
                      className="comment-username"
                      style={
                        comment.User?.nameColor
                          ? { color: comment.User.nameColor }
                          : undefined
                      }
                    >
                      {comment.User?.username || "Ẩn danh"}
                    </h4>
                    {comment.User?.badge && (
                      <span className="bg-yellow-200 text-xs px-2 py-0.5 rounded-full font-medium text-gray-800">
                        {comment.User.badge}
                      </span>
                    )}
                    {comment.User?.vipLevel > 0 && (
                      <span className="text-xs font-medium text-purple-600">
                        VIP {comment.User.vipLevel}
                      </span>
                    )}
                  </div>

                  <div className="comment-meta">
                    {comment.User?.tuVi || "Phàm Nhân"} -{" "}
                    {comment.User?.realm || "Hạ Giới"}
                  </div>

                  <p className="comment-content">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
      )}
    </div>
  );
};

export default HomeComments;
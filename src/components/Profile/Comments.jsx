import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../config";
import { Link } from "react-router-dom";

const Comments = ({ user }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    fetch(`${API_BASE_URL}/api/comment/user`, {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setComments(data.comments || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  if (!user?.token) return null;

  return (
    <div className="bg-white rounded shadow p-4">
      <div className="font-bold text-base mb-2 text-[#2196f3]">Lịch sử bình luận</div>
      {loading ? (
        <div className="text-gray-500">Đang tải...</div>
      ) : comments.length === 0 ? (
        <div className="text-xs text-gray-500">Bạn chưa bình luận truyện nào.</div>
      ) : (
        <ul className="text-xs text-gray-800 space-y-2">
          {comments.map((c) => (
            <li key={c.id} className="flex flex-col gap-1 border-b pb-2 last:border-b-0">
              <div>
                <span className="font-semibold">{c.comicSlug}</span>
                <span className="ml-2 text-gray-500 text-xs">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : ""}
                </span>
              </div>
              <div className="text-gray-700">{c.content}</div>
              <Link
                to={`/truyen/${c.comicSlug}`}
                className="text-blue-500 hover:underline text-xs"
              >
                Xem truyện
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Comments;

import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

import AccountsManager from "./components/AccountsManager";
import ComicsManager from "./components/ComicsManager";
import MessagesManager from "./components/MessagesManager";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('accounts');
  const [users, setUsers] = useState([]);
  const [comics, setComics] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState(1);
  const [totalComics, setTotalComics] = useState(0);
  const navigate = useNavigate();

  const API_BASE_URL = 'http://localhost:3001';

  const getToken = () => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser).token : null;
  };

  useEffect(() => {
    const p = parseInt(searchParams.get("page") || "1", 10);
    setPage(isNaN(p) || p < 1 ? 1 : p);
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getToken();
        if (!token) {
          setError('Vui lòng đăng nhập với quyền admin');
          navigate('/login');
          return;
        }

        if (activeTab === 'accounts') {
          const res = await axios.get(`${API_BASE_URL}/api/user/admin/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsers(res.data.users || []);
        } else if (activeTab === 'comics') {
          const res = await axios.get(`https://otruyenapi.com/v1/api/danh-sach?type=truyen-moi&page=${page}`);
          setComics(res.data.data?.items || []);
          const pagination = res.data.data?.params?.pagination;
          const total = pagination
            ? Math.ceil(pagination.totalItems / pagination.totalItemsPerPage)
            : 1;
          setTotalPages(total);
          setTotalComics(pagination?.totalItems || 0);
        } else if (activeTab === 'messages') {
          const res = await axios.get(`${API_BASE_URL}/api/comment`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setComments(res.data.comments || []);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Lỗi khi tải dữ liệu.');
      }
      setLoading(false);
    };
    fetchData();
  }, [activeTab, page, navigate]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = getToken();
      if (!token) {
        setError('Vui lòng đăng nhập để thay đổi quyền');
        return;
      }
      await axios.post(
        `${API_BASE_URL}/api/user/role`,
        { userId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map(user => (user._id === userId ? { ...user, role: newRole } : user)));
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi cập nhật quyền');
    }
  };

  const goToPage = (p) => {
    if (p >= 1 && p <= totalPages) {
      setSearchParams({ page: p });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black font-sans">
      <div className="flex max-w-7xl mx-auto">
        <aside className="w-64 bg-gray-800 text-white p-4 flex-shrink-0">
          <h2 className="text-2xl font-bold mb-6">Quản lý Admin</h2>
          <ul className="space-y-2">
            <li
              className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'accounts' ? 'bg-[#2196f3] text-white' : 'hover:bg-gray-600'}`}
              onClick={() => setActiveTab('accounts')}
            >
              Tài khoản
            </li>
            <li
              className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'messages' ? 'bg-[#2196f3] text-white' : 'hover:bg-gray-600'}`}
              onClick={() => setActiveTab('messages')}
            >
              Bình luận
            </li>
            <li
              className={`p-3 rounded-lg cursor-pointer transition-colors ${activeTab === 'comics' ? 'bg-[#2196f3] text-white' : 'hover:bg-gray-600'}`}
              onClick={() => setActiveTab('comics')}
            >
              Danh sách truyện
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {loading && <p className="text-gray-500 text-lg">Đang tải...</p>}
          {error && <p className="text-red-500 text-lg mb-4">{error}</p>}

          {activeTab === 'accounts' && (
            <AccountsManager
              users={users}
              loading={loading}
              error={error}
              handleRoleChange={handleRoleChange}
            />
          )}
          {activeTab === 'comics' && (
            <ComicsManager
              comics={comics}
              totalComics={totalComics}
              page={page}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          )}
          {activeTab === 'messages' && (
            <MessagesManager comments={comments} />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

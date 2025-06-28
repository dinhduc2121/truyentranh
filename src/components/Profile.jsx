import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Profile = ({ user, onLogout }) => {
  const [profile, setProfile] = useState(null);
  const [followed, setFollowed] = useState([]);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("followed");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [email, setEmail] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [crystal, setCrystal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tuVi, setTuVi] = useState("");
  const [role, setRole] = useState("");
  const [showTuViForm, setShowTuViForm] = useState(false);
  const [tuViInput, setTuViInput] = useState("");
  const navigate = useNavigate();

  // Lấy thông tin tài khoản
  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:3001/api/user/profile", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProfile(data);
        setEmail(data.email || "");
        setCrystal(data.linhThach || 0);
        setTuVi(data.tuVi || "Phàm Nhân");
        setRole(data.role || "member");
        setLoading(false);
      });
  }, [user]);

  // Lấy truyện đã theo dõi (lấy thêm thông tin truyện)
  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:3001/api/user/followed", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const slugs = data.followedComics || [];
        // Lấy thông tin truyện cho từng slug
        const comics = await Promise.all(
          slugs.map(slug =>
            fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
              .then(res => res.json())
              .then(d => ({
                slug,
                name: d.data?.item?.name || slug,
                thumb_url: d.data?.item?.thumb_url || "",
                author: Array.isArray(d.data?.item?.author) ? d.data.item.author.join(", ") : (d.data?.item?.author || ""),
                status: d.data?.item?.status || "",
                chap: d.data?.item?.chap || "",
              }))
              .catch(() => ({
                slug,
                name: slug,
                thumb_url: "",
                author: "",
                status: "",
                chap: ""
              }))
          )
        );
        setFollowed(comics);
      });
  }, [user]);

  // Lấy lịch sử đọc (lấy thêm thông tin truyện)
  useEffect(() => {
    if (!user?.token) return;
    fetch("http://localhost:3001/api/user/history", {
      headers: { Authorization: `Bearer ${user.token}` }
    })
      .then(res => res.json())
      .then(async data => {
        const historyArr = data.readingHistory || [];
        const uniqueSlugs = [...new Set(historyArr.map(h => h.slug))];
        const comicsInfo = await Promise.all(
          uniqueSlugs.map(slug =>
            fetch(`https://otruyenapi.com/v1/api/truyen-tranh/${slug}`)
              .then(res => res.json())
              .then(d => ({
                slug,
                name: d.data?.item?.name || slug,
                thumb_url: d.data?.item?.thumb_url || "",
              }))
              .catch(() => ({
                slug,
                name: slug,
                thumb_url: ""
              }))
          )
        );
        // Map slug -> info
        const infoMap = {};
        comicsInfo.forEach(c => { infoMap[c.slug] = c; });
        // Gắn info vào history
        setHistory(historyArr.map(h => ({
          ...h,
          name: infoMap[h.slug]?.name || h.slug,
          thumb_url: infoMap[h.slug]?.thumb_url || "",
        })));
      });
  }, [user]);

  if (!user?.token) {
    return (
      <div className="max-w-2xl mx-auto py-10 text-center">
        <div className="text-lg mb-4">Bạn chưa đăng nhập.</div>
        <Link to="/login" className="px-4 py-2 bg-indigo-600 text-white rounded">Đăng nhập</Link>
      </div>
    );
  }

  if (loading || !profile) {
    return <div className="max-w-2xl mx-auto py-10 text-center">Đang tải thông tin tài khoản...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-white text-black min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Thông tin tài khoản</h1>
        <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600" onClick={onLogout}>Đăng xuất</button>
      </div>

      {/* Main Profile Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex flex-col items-center justify-center">
            <img src="https://placehold.co/200" alt="Avatar" className="rounded-full w-40 h-40 object-cover mb-4 border-4 border-blue-500" />
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Đổi ảnh đại diện</button>
          </div>
          <div className="md:w-2/3 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Tên người dùng: <span className="text-blue-600">{profile.username}</span>
            </h2>
            <div className="mb-4">
              <span className="font-semibold">Email:</span>
              <span className="text-gray-700 ml-2">{email}</span>
              <button className="ml-2 text-sm text-blue-500 hover:underline" onClick={() => setShowEmailForm(v => !v)}>Thay đổi</button>
            </div>
            {showEmailForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Thay đổi email</h3>
                <input type="email" className="w-full p-2 mb-2 border rounded" placeholder="Nhập email mới" value={emailInput} onChange={e => setEmailInput(e.target.value)} />
                <div className="flex justify-end space-x-2">
                  <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowEmailForm(false)}>Hủy</button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => { setEmail(emailInput); setShowEmailForm(false); }}>Xác nhận</button>
                </div>
              </div>
            )}
            <div className="mb-4">
              <span className="font-semibold">Mật khẩu:</span>
              <button className="ml-2 text-sm text-blue-500 hover:underline" onClick={() => setShowPasswordForm(v => !v)}>Thay đổi</button>
            </div>
            {showPasswordForm && (
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Thay đổi mật khẩu</h3>
                <input type="password" className="w-full p-2 mb-2 border rounded" placeholder="Mật khẩu hiện tại" />
                <input type="password" className="w-full p-2 mb-2 border rounded" placeholder="Mật khẩu mới" />
                <input type="password" className="w-full p-2 mb-2 border rounded" placeholder="Nhập lại mật khẩu mới" />
                <div className="flex justify-end space-x-2">
                  <button className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowPasswordForm(false)}>Hủy</button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Xác nhận</button>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <span className="font-semibold">Linh thạch:</span>
              <span className="ml-2 text-xl text-purple-600 font-bold flex items-center">
                <span>{crystal}</span>
                <img src="https://placehold.co/30x30" alt="Linh thạch" className="ml-1 w-6 h-6" />
              </span>
              <button className="ml-4 px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600">Nạp thêm</button>
            </div>
            <div className="mt-4 flex items-center">
              <span className="font-semibold">Tu vi:</span>
              <span className="ml-2 text-base text-green-700 font-bold">{tuVi}</span>
            </div>
            <div className="mt-2 flex items-center">
              <span className="font-semibold">Quyền:</span>
              <span className="ml-2 text-base text-blue-700 font-bold capitalize">{role}</span>
              {role === "admin" && (
                <button
                  type="button"
                  className="ml-4 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm font-semibold"
                  onClick={() => navigate("/admin/users")}
                >
                  Quản lý
                </button>
              )}
            </div>
            <div className="mt-4">
              <span className="font-semibold">Ngày đăng ký:</span>
              <span className="text-gray-700 ml-2">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ""}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 font-medium ${tab === "followed" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          onClick={() => setTab("followed")}
        >
          Truyện đã theo dõi
        </button>
        <button
          className={`px-4 py-2 font-medium ${tab === "history" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600 hover:text-blue-600"}`}
          onClick={() => setTab("history")}
        >
          Lịch sử đọc truyện
        </button>
      </div>

      {/* Tab Content */}
      {tab === "followed" && (
        <div id="followed-tab">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {followed.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">Bạn chưa theo dõi truyện nào.</div>
            ) : (
              followed.map((comic, idx) => (
                <div key={comic.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
                  <div className="relative">
                    <img
                      src={comic.thumb_url
                        ? (comic.thumb_url.startsWith("http")
                          ? comic.thumb_url
                          : `https://img.otruyenapi.com/uploads/comics/${comic.thumb_url}`)
                        : "https://via.placeholder.com/600x400?text=No+Image"}
                      alt={comic.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${
                      comic.status === "Hoàn thành"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-500 text-white"
                    }`}>
                      {comic.status || "Đang tiến hành"}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 hover:text-blue-600 cursor-pointer">
                      <Link to={`/truyen/${comic.slug}`}>{comic.name}</Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">Tác giả: {comic.author || "?"}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Chương mới nhất: <span className="font-semibold">{comic.chap || "?"}</span></span>
                      <button className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600">Hủy theo dõi</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="flex justify-center">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Xem thêm</button>
          </div>
        </div>
      )}
      {tab === "history" && (
        <div id="history-tab">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {history.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-8">Bạn chưa đọc truyện nào.</div>
            ) : (
              history.map((item, idx) => (
                <div key={item.slug + idx} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg">
                  <div className="relative">
                    <img
                      src={
                        item.thumb_url
                          ? (item.thumb_url.startsWith("http")
                            ? item.thumb_url
                            : `https://img.otruyenapi.com/uploads/comics/${item.thumb_url}`)
                          : "https://via.placeholder.com/600x400?text=No+Image"
                      }
                      alt={item.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 hover:text-blue-600 cursor-pointer">
                      <Link to={`/truyen/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <div className="text-gray-600 text-sm mb-2">Chương đã đọc: {item.chapter}</div>
                    <div className="text-xs text-gray-400">
                      Cập nhật: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;


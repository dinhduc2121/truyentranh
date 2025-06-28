import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        // ✅ Tự decode JWT để lấy role
        const payload = JSON.parse(atob(data.token.split(".")[1]));

        // ✅ Gọi onLogin và lưu user đầy đủ
        const user = {
          token: data.token,
          username: payload.username,
          role: payload.role
        };
        onLogin(user);
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/home");
      } else {
        setError(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-6 rounded shadow w-full max-w-xs"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Đăng nhập tài khoản</h2>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <div className="mb-3">
          <label className="block mb-1 text-sm">Tài khoản</label>
          <input
            type="text"
            className="w-full border rounded px-2 py-1"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Mật khẩu</label>
          <input
            type="password"
            className="w-full border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        <button
          type="button"
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-black font-semibold py-2 rounded"
          onClick={() => navigate("/register")}
        >
          Đăng ký ngay
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useState } from "react";
import { API_BASE_URL } from "../../config";

const Register = ({ onRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    console.log("BẮT ĐẦU SUBMIT FORM");
    console.log("API_BASE_URL:", API_BASE_URL);

    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          tuVi: "Phàm Nhân",   // giá trị mặc định
          role: "member"       // giá trị mặc định
        }),
      });

      console.log("Response raw:", res);

      const data = await res.json();

      console.log("Response JSON:", data);

      if (data.success) {
        setSuccess("Đăng ký thành công! Bạn có thể đăng nhập.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirm("");
      } else {
        setError(data.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Lỗi fetch:", err);
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
        <h2 className="text-xl font-bold mb-4 text-center">Đăng ký tài khoản</h2>

        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        {success && <div className="text-green-600 mb-2 text-sm">{success}</div>}

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

        <div className="mb-3">
          <label className="block mb-1 text-sm">Email</label>
          <input
            type="email"
            className="w-full border rounded px-2 py-1"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 text-sm">Mật khẩu</label>
          <input
            type="password"
            className="w-full border rounded px-2 py-1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Nhập lại mật khẩu</label>
          <input
            type="password"
            className="w-full border rounded px-2 py-1"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded"
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
};

export default Register;

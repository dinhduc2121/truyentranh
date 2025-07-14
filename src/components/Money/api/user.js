import { API_BASE_URL } from "../../../../config";

export async function getCurrentUser(token) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Không thể lấy thông tin người dùng');
  }

  return res.json();
}

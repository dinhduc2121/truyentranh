// src/api/deposit.js
import { API_BASE_URL } from "../../../../config";
export async function createDeposit({ price, method, token }) {
  const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/deposits/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ price, method }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Lỗi khi gửi yêu cầu nạp");
  }

  return res.json();
}

// src/api/cardDeposit.js
export async function createCardDeposit({
  price,
  cardType,
  cardSerial,
  cardCode,
  token,
}) {
  const res = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}/card-deposits/request`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        price,
        cardType,
        cardSerial,
        cardCode,
      }),
    }
  );

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Lỗi khi gửi yêu cầu nạp thẻ");
  }

  return res.json();
}

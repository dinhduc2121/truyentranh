import React from "react";
import { API_BASE_URL } from "../../config";

const Footer = () => (
  <footer className="mt-10 py-6 bg-[#44346a] text-white text-center rounded shadow">
    <div className="max-w-7xl mx-auto px-4">
      <div className="font-bold text-lg mb-1">Mộng Truyện</div>
      <div className="text-sm mb-1">© {new Date().getFullYear()} Mộng Truyện. All rights reserved.</div>
      <div className="text-xs text-gray-300">Website đọc truyện tranh miễn phí, cập nhật liên tục.</div>
    </div>
  </footer>
);

export default Footer;

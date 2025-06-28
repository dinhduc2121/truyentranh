import React, { useState } from "react";

const AccountsManager = ({ users, handleRoleChange }) => {
  const [expandedUserId, setExpandedUserId] = useState(null);

  const toggleExpand = (userId) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-[#2196f3]">
        Quản lý tài khoản
      </h2>
      {users.length === 0 && (
        <p className="text-gray-500 text-lg">Không có tài khoản nào.</p>
      )}
      {users.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <th className="border p-3 text-left">Tên tài khoản</th>
                <th className="border p-3 text-left">Linh thạch</th>
                <th className="border p-3 text-left">Thời gian tạo</th>
                <th className="border p-3 text-left">Quyền</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <React.Fragment key={user._id}>
                  <tr
                    className="hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => toggleExpand(user._id)}
                  >
                    <td className="border p-3 font-medium text-gray-800">
                      {user.username}
                    </td>
                    <td className="border p-3 text-blue-600 font-semibold">
                      {user.linhThach || 0}
                    </td>
                    <td className="border p-3">
                      {new Date(user.createdAt).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        className="border p-1 rounded focus:ring-2 focus:ring-[#ffb300] bg-white"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                  {expandedUserId === user._id && (
                    <tr>
                      <td colSpan="4" className="border-t p-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Avatar */}
                          <div className="flex flex-col items-center space-y-2">
                            <img
                              src={
                                user.avatar ||
                                "https://placehold.co/100x100?text=Avatar"
                              }
                              alt={`${user.username} avatar`}
                              className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                            />
                            <div className="text-center">
                              <p className="font-semibold text-gray-800">
                                {user.username}
                              </p>
                              <p className="text-gray-500">
                                {user.email || "Không có email"}
                              </p>
                            </div>
                          </div>

                          {/* Lịch sử đọc */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Lịch sử đọc
                            </h4>
                            {user.readingHistory?.length > 0 ? (
                              <ul className="space-y-1 text-sm text-gray-600 list-disc pl-4">
                                {user.readingHistory.slice(0, 5).map((h, i) => (
                                  <li key={i}>
                                    <span className="font-medium">{h.slug}</span>
                                    : Chương {h.chapter}
                                  </li>
                                ))}
                                {user.readingHistory.length > 5 && (
                                  <li className="text-gray-400 italic">...</li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                Không có dữ liệu.
                              </p>
                            )}
                          </div>

                          {/* Truyện theo dõi */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Truyện theo dõi
                            </h4>
                            {user.followedComics?.length > 0 ? (
                              <ul className="space-y-1 text-sm text-gray-600 list-disc pl-4">
                                {user.followedComics.slice(0, 5).map((c, i) => (
                                  <li key={i}>{c}</li>
                                ))}
                                {user.followedComics.length > 5 && (
                                  <li className="text-gray-400 italic">...</li>
                                )}
                              </ul>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                Không có dữ liệu.
                              </p>
                            )}
                          </div>

                          {/* Lịch sử tiêu và nạp linh thạch */}
                          <div>
                            <h4 className="font-semibold text-gray-700 mb-2">
                              Lịch sử tiêu và nạp linh thạch
                            </h4>
                            {user.crystalHistory?.length > 0 ? (
                              <div className="overflow-x-auto">
                                <table className="min-w-full border text-sm">
                                  <thead>
                                    <tr className="bg-blue-100">
                                      <th className="border p-2">Ngày</th>
                                      <th className="border p-2">Mô tả</th>
                                      <th className="border p-2">Số lượng</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {user.crystalHistory.slice(0, 5).map((item, i) => (
                                      <tr key={i}>
                                        <td className="border p-2">{item.date}</td>
                                        <td className="border p-2">{item.description}</td>
                                        <td
                                          className={`border p-2 ${
                                            item.amount < 0
                                              ? "text-red-600"
                                              : "text-green-600"
                                          }`}
                                        >
                                          {item.amount > 0 ? "+" : ""}
                                          {item.amount} LT
                                        </td>
                                      </tr>
                                    ))}
                                    {user.crystalHistory.length > 5 && (
                                      <tr>
                                        <td
                                          colSpan="3"
                                          className="text-center text-gray-400 italic"
                                        >
                                          ...
                                        </td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-sm">
                                Không có dữ liệu.
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountsManager;

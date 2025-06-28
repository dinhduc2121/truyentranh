// MongoDB user schema suggestion for account management, followed comics, reading history, and linh thach

// If you use Mongoose (Node.js ODM), you can define the schema like this:

const mongoose = require('mongoose');

const ReadingHistorySchema = new mongoose.Schema({
  comic: { type: String, required: true }, // comic slug or id
  chapter: { type: String, required: true },
  lastReadAt: { type: Date, default: Date.now }
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  email: { type: String },
  followedComics: [{ type: String }], // array of comic slugs or ids
  readingHistory: [ReadingHistorySchema],
  linhThach: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);

// If you use native MongoDB, you can create documents with this structure:

/*
{
  _id: ObjectId("..."),
  username: "abc123",
  passwordHash: "...",
  email: "abc@gmail.com",
  followedComics: ["one-piece", "naruto"],
  readingHistory: [
    { comic: "one-piece", chapter: "1050", lastReadAt: ISODate("2024-06-01T10:00:00Z") },
    { comic: "naruto", chapter: "700", lastReadAt: ISODate("2024-06-02T12:00:00Z") }
  ],
  linhThach: 100,
  createdAt: ISODate("2024-06-01T09:00:00Z"),
  updatedAt: ISODate("2024-06-02T12:00:00Z")
}
*/

// Quản lý tài khoản đã tạo (gợi ý):
// 1. Dùng lệnh MongoDB hoặc Mongoose để lấy danh sách, tìm kiếm, cập nhật, xóa tài khoản.
// 2. Ví dụ với Mongoose:

// Lấy tất cả tài khoản:
async function getAllUsers() {
  return await mongoose.model('User').find({});
}

// Tìm tài khoản theo username:
async function findUserByUsername(username) {
  return await mongoose.model('User').findOne({ username });
}

// Xóa tài khoản:
async function deleteUser(username) {
  return await mongoose.model('User').deleteOne({ username });
}

// Cập nhật tài khoản (ví dụ cập nhật linh thạch):
async function updateLinhThach(username, amount) {
  return await mongoose.model('User').updateOne(
    { username },
    { $set: { linhThach: amount, updatedAt: new Date() } }
  );
}

// Có thể dùng các hàm này trong admin panel hoặc API backend để quản lý tài khoản.

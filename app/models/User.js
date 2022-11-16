const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: [8, "Short Password!"] },
  userName: { type: String, requird: true },
  phone: { type: String, required: true },
  address: { type: String, require: true },
  gender: { type: String, required: true },
  role: { type: String, required: true },
  birthdate: {type: Date, rquired: true},
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});
module.exports = mongoose.model("User", UserSchema);

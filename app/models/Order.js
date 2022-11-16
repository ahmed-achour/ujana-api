const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: { type: [mongoose.Schema.Types.Mixed] },
  totale: { type: Number, required: true },
  Status: { type: String, default:"PENDING" },
}, { timestamps: true });
module.exports = mongoose.model("Order", OrderSchema);

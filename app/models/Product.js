const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true},
  qte: { type: Number, required: true},
  price: { type: Number, required: true},
  image:{type:String, required: true},
  description: { type: String, required: true},
  brand:{type:String, required: true},
  category:{type: mongoose.Schema.Types.ObjectId, ref: "Category"},
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: null },
  deleted_at: { type: Date, default: null },
});
module.exports = mongoose.model("Product", ProductSchema);

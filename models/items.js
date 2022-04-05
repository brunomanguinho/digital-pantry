const path = require("path");
const dao = require(path.join(__dirname, "../dao/mongoose"));

const mongoose = dao.conn;

const itemSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  pantry_id: {
    type: dao.conn.Schema.Types.ObjectId,
    ref: 'Pantry'
  }
})

const item = new mongoose.model("Item", itemSchema);

module.exports = item;

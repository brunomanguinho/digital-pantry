const path = require("path");
const dao = require(path.join(__dirname, "../dao/mongoose"));

const mongoose = dao.conn;

const pantrySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String
});

const pantry = new mongoose.model("Pantry", pantrySchema);

module.exports = pantry;

module.exports.schema = pantrySchema;

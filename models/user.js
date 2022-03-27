const path = require("path");
const dao = require(path.join(__dirname, "../dao/mongoose"));

const mongoose = dao.conn;

const userSchema = new mongoose.Schema({
  login: String,
  password: String
});

exports.User = new mongoose.model("User", userSchema);

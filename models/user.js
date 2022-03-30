const path = require("path");
const dao = require(path.join(__dirname, "../dao/mongoose"));
const passportLocalMongoose = require("passport-local-mongoose");

const mongoose = dao.conn;

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const user = new mongoose.model("User", userSchema);

module.exports = user;

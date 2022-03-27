const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pantryDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
  login: String,
  password: String
});

exports.User = new mongoose.model("User", userSchema);

const path = require("path");
const User = require("user");
const dao = require(path.join(__dirname, "../dao/mongoose"));

const mongoose = dao.conn;

const pantrySchema = new mongoose.Schema({
  name: string,
  description: string,
  user_id: User
});

export.Pantry = new mongoose.Model("Pantry", pantrySchema);

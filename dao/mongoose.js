const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/pantryDB", {useNewUrlParser: true});

exports.conn = mongoose;

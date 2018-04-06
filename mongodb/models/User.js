const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GoogleUserSchema = new Schema({
  googleID: String,
  name: String

});

//Different way of doing it than Item
mongoose.model("users", GoogleUserSchema);
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  password: {
    type: String,
    required: true,
    validate: [
      function(input) {
        return input.length >= 6;
      },
      "Password should be longer."
    ]
  },
  email: {
    type: String,
    required: true,
    match: [/.+@.+\..+/, "Please enter a valid e-mail address"]
  },
  favorites: {
    type: Array,
  },
  influencers: {
    type: Array,
  },
  admin: {
    type: Boolean,
    default: false
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
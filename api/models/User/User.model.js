const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: String,
    profile_img: {
        public_id: String,
        secure_url: String
    },
    portada_img: String,
    username: String,
    password: String,
    description: String,
    country: String,
    birthday: Date,
    typeUser: String,
    email: String,
  },
  { timestamps: true }
);

const User = model("User", UserSchema);

module.exports = { User };

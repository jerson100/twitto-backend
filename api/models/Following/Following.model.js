const mongoose = require("mongoose");

const FollowingSchema = new mongoose.Schema(
  {
    followerUser: {
      //usuario seguidor
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    followedUser: {
      //usuario seguido
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    state: Number,
  },
  { timestamps: true }
);

const Following = mongoose.model("Following", FollowingSchema);

module.exports = { Following };

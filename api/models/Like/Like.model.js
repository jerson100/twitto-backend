const { model, Schema } = require("mongoose");

const LikeSchema = new Schema(
  {
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Like = model("Like", LikeSchema);

module.exports = {
  Like,
};

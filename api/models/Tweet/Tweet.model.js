const mongoose = require("mongoose");
const { Like } = require("../Like/Like.model");

const TweetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    description: String,
    isFijado: Boolean,
  },
  { timestamps: true }
);

//para obtener la cantidad de likes de un tweet
TweetSchema.virtual("likes").get(async function () {
  return await Like.findById(this._id).countDocuments();
});

// para obtener la cantidad de comentarios de un tweet
// TweetSchema.virtual("likes").get(async function () {
//   return await Like.findById(this._id).countDocuments();
// });

const Tweet = mongoose.model("Tweet", TweetSchema);

module.exports = { Tweet };

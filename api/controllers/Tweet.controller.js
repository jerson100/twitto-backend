const { Tweet } = require("../models/Tweet/Tweet.model");
const { FindTweetByIdException } = require("../models/Tweet/Tweet.exception");

const add = async ({ user, description, isFijado }) => {
  const newTweet = await Tweet({ user, description, isFijado });
  return await newTweet.save();
};

const all = async () => {
  const tweets = await Tweet.find().populate(
    "user",
    "-password -createdAt -updatedAt -birthday"
  );
  return tweets;
};

const remove = async (id) => {
  const tweet = await Tweet.findByIdAndDelete(id, { __v: 0 });
  return tweet;
};

const getById = async (id) => {
  const tweet = await Tweet.findById(id, { __v: 0 }).populate(
    "user",
    "-password -createdAt -updatedAt -birthday -__v"
  );

  if (!tweet) {
    throw new FindTweetByIdException();
  }

  return tweet;
};

module.exports = { add, all, remove, getById };

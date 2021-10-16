const {
  CreateFollowingException,
  UnFollowException,
} = require("../models/Following/Following.exception");
const { Following } = require("../models/Following/Following.model");

const all = async () => {
  const followers = await Following.find({})
    .populate("followerUser")
    .populate("followedUser");
  return followers;
};

const getFollowersById = async (idUser) => {
  const followers = await Following.find({ idFollowerUser: idUser });
  return followers;
};

const getFollowedsById = async (idUser) => {
  const followers = await Following.find({ idFollowedUser: idUser });
  return followers;
};

const verifyFollow = async (followerUser, followedUser) => {
  const following = await Following.find({
    followerUser,
    followedUser,
    status: 1,
  });
  return !!following;
};

const existsFollowing = async (followerUser, followedUser) => {
  const following = await Following.findOne({ followerUser, followedUser });
  return following;
};

const setFollow = async (followerUser, followedUser) => {
  let newFollow;
  const currentFollow = await existsFollowing(followerUser, followedUser);
  if (!currentFollow) {
    newFollow = await new Following({ followerUser, followedUser, state: 1 });
    return await newFollow.save();
  } else {
    if (currentFollow.state === 0) {
      newFollow = Following.updateOne(
        { followerUser, followedUser },
        {
          $set: {
            state: 1,
          },
        }
      );
      return newFollow;
    } else {
      throw new CreateFollowingException(
        "Ese usuario ya sigue al otro usuario"
      );
    }
  }
};

const setUnFollow = async (followerUser, followedUser) => {
  const currentFollow = await existsFollowing(followerUser, followedUser);
  if (!currentFollow || currentFollow.state === 0) {
    throw new UnFollowException();
  } else {
    const newFollower = await Following.updateOne(
      {
        followerUser,
        followedUser,
      },
      {
        $set: {
          state: 0,
        },
      }
    );
    return newFollower;
  }
};

module.exports = {
  setFollow,
  getFollowersById,
  getFollowedsById,
  setUnFollow,
  all,
};

const { Tweet } = require("../models/Tweet/Tweet.model");
const { FindTweetByIdException } = require("../models/Tweet/Tweet.exception");
const { Following } = require("../models/Following/Following.model");
const {
  Types: { ObjectId },
} = require("mongoose");
const { FOLLOWING_STATE } = require("../configs/constant");

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

const allFollowing = async (idUser) => {
  //   const tweets = await Following.find(
  //     { followerUser: idUser, state: ACCOUNTS_STATE.ACTIVE },
  //     { followerUser: 0, __v: 0, updatedAt: 0 }
  //   ).populate("followedUser", "-password -createdAt -updatedAt -birthday -__v");
  const tweets = await Following.aggregate([
    {
      $match: {
        followerUser: new ObjectId(idUser),
        state: FOLLOWING_STATE.ACTIVE,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "followedUser",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
      },
    },
    {
      $project: {
        "user.password": 0,
        "user.__v": 0,
        "user.updatedAt": 0,
        __v: 0,
        followerUser: 0,
        followedUser: 0,
      },
    },
  ]);
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

const getByIdUserAndIdTweet = async (idUser, idTweet) => {
  const tweet = await Tweet.findOne(
      { user: idUser, _id: idTweet },
      { __v: 0 }
  ).populate("user", "-password -createdAt -updatedAt -birthday -__v");
  return tweet;
};

const getTweetsIFollow2 = async (idUser) => {
  //obtenemos todos los usuarios a quien sigue el usuario(idUser)
  const usersId = (await Following.find({ followerUser: idUser })).map(
      (us) => us.followedUser
  );
  //obtener todos los tweets de los usuarios a quienes sigo...
  const tweets = await Tweet.find(
      { user: { $in: usersId } },
      { isFijado: 0, updatedAt: 0, __v: 0 }
  )
      .populate("user", "-password -__v -updatedAt")
      .sort({ createdAt: -1 });
  return tweets;
};

const getTweetsIFollow = async (idUser, datetime, per_page) => {
  const pipeline = [
    {
      $match: {
        followerUser: new ObjectId(idUser)
      }
    },
    {
      $lookup: {
        from: "tweets",
        localField: "followedUser",
        foreignField: "user",
        as: "tweets",
      }
    },
    {
      $unwind: {
        path: "$tweets",
      }
    },
    {
      $sort: {
        "tweets.createdAt": -1
      }
    },
    {
      $limit: per_page || 20
    },
    {
      $lookup:
          {
            from: "users",
            localField: "tweets.user",
            foreignField: "_id",
            as: "user"
          }
    },
    {
      $project: {
        _id: "$tweets._id",
        description: "$tweets.description",
        createdAt: "$tweets.createdAt",
        updatedAt: "$tweets.updatedAt",
        user: {
          $arrayElemAt: [
            {
              $map: {
                input: "$user",
                as: "i",
                in: {
                  _id: "$$i._id",
                  name: "$$i.name",
                  username: "$$i.username",
                  country: "$$i.country",
                  typeUser: "$$i.typeUser",
                  email: "$$i.email",
                  createdAt: "$$i.createdAt",
                  profile_img: "$$i.profile_img",
                }
              }
            },
            0
          ]
        }
      }
    }
  ];
  if(datetime){
    pipeline.splice(4,0,{
      $match: {
        "tweets.createdAt": {
          $lt: new Date(parseInt(datetime))
        }
      }
    });
  }
  const tweets = await Following.aggregate(pipeline);
  return tweets;
};

module.exports = {
  add,
  all,
  remove,
  getById,
  getByIdUserAndIdTweet,
  allFollowing,
  getTweetsIFollow,
  getTweetsIFollow2,
};

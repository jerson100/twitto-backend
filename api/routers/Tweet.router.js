const express = require("express");
const { CreateTweetSchema, ValidationTweetPaginationSchema} = require("../models/Tweet/Tweet.validation");
const TweetController = require("../controllers/Tweet.controller");
const requestValidation = require("../middlewares/requestValidation");
const { schemaValidation } = require("../middlewares/ValidationSchema");
const { validateObjectIdSchema } = require("../utils/validation/objectId");
const { verifyUserAuthenticationToken } = require("../middlewares/token");
const { isItMyTweet } = require("../middlewares/tweet");
const { USERS_TYPE } = require("../configs/constant");
const { verifyUsersType } = require("../middlewares/user");

const Router = express.Router();

Router.route("/")
  .get(
    verifyUserAuthenticationToken,
    verifyUsersType(USERS_TYPE.ADMINISTRATOR),
    requestValidation(async (req, res) => {
      const { _id: idUser } = req.us;
      const tweets = await TweetController.allFollowing(idUser);
      return res.json({ data: tweets });
    })
  )
  .post(
    verifyUserAuthenticationToken,
    schemaValidation(CreateTweetSchema),
    requestValidation(async (req, res) => {
      const newTweet = await TweetController.add({
        ...req.body,
        user: req.us._id,
      });
      return res.status(201).json({
        data: {
          ...newTweet._doc,
          user: req.us,
        },
      });
    })
  );

Router.route("/:idTweet")
  .get(
    verifyUserAuthenticationToken,
    schemaValidation(validateObjectIdSchema("idTweet"), "params"),
    requestValidation(async (req, res) => {
      const { idTweet } = req.params;
      const tweet = await TweetController.getById(idTweet);
      return res.json({ data: tweet });
    })
  )
  .delete(
    verifyUserAuthenticationToken,
    isItMyTweet,
    schemaValidation(validateObjectIdSchema("idTweet"), "params"),
    requestValidation(async (req, res) => {
      const { idTweet } = req.params;
      await TweetController.remove(idTweet);
      return res.status(200).send();
    })
  );

/**
 * Obtenemos todos los tweets de los usuarios a los que sigue
 * el usuario que accedió a la aplicación.
 */
Router.get(
  "/timeline/feed",
  verifyUserAuthenticationToken,
  schemaValidation(ValidationTweetPaginationSchema, "query"),
  requestValidation(async (req, res) => {
    const { _id: idUser } = req.us;
    const { datetime, per_page } = req.query;
    const tweets = await TweetController.getTweetsIFollow(idUser, datetime, parseInt(per_page));
    return res.json({ data: tweets });
  })
);

module.exports = Router;

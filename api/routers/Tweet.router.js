const express = require("express");
const { CreateTweetSchema } = require("../models/Tweet/Tweet.validation");
const TweetController = require("../controllers/Tweet.controller");
const requestValidation = require("../middlewares/requestValidation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const { validateObjectIdSchema } = require("../utils/validation/objectId");

const Router = express.Router();

Router.route("/")
  .get(
    requestValidation(async (req, res) => {
      const tweets = await TweetController.all();
      return res.json({ data: tweets });
    })
  )
  .post(
    [validationSchema(CreateTweetSchema)],
    requestValidation(async (req, res) => {
      const newTweet = await TweetController.add(req.body);
      return res.status(201).json({ data: newTweet });
    })
  );

Router.route("/:idTweet")
  .get(
    [validationSchema(validateObjectIdSchema("idTweet"), "params")],
    requestValidation(async (req, res) => {
      const { idTweet } = req.params;
      const tweet = await TweetController.getById(idTweet);
      return res.json({ data: tweet });
    })
  )
  .delete(
    [
      validationSchema(validateObjectIdSchema("idTweet"), "params"),
      validationSchema(CreateTweetSchema),
    ],
    requestValidation(async (req, res) => {
      const { idTweet } = req.params;
      await TweetController.remove(idTweet);
      return res.status(200).send();
    })
  );

module.exports = Router;

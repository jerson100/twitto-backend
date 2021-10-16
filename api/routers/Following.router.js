const express = require("express");
const FollowingController = require("../controllers/Following.controller");
const {
  CreateFollowingSchema,
} = require("../models/Following/Following.validation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const requestValidation = require("../middlewares/requestValidation");
const Router = express.Router();

Router.route("/")
  .get(
    requestValidation(async (req, res) => {
      const followings = await FollowingController.all();
      return res.json({ data: followings });
    })
  )
  .post(
    validationSchema(CreateFollowingSchema),
    requestValidation(async (req, res) => {
      const { followerUser, followedUser } = req.body;
      await FollowingController.setFollow(followerUser, followedUser);
      return res.status(201).send();
    })
  );

module.exports = Router;

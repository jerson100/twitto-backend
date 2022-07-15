const express = require("express");
const FollowingController = require("../controllers/Following.controller");
const {
  CreateFollowingSchema,
} = require("../models/Following/Following.validation");
const { schemaValidation } = require("../middlewares/ValidationSchema");
const requestValidation = require("../middlewares/requestValidation");
const { verifyUserAuthenticationToken } = require("../middlewares/token");
const Router = express.Router();

Router.route("/")
  .get(
    requestValidation(async (req, res) => {
      //   const followings = await FollowingController.all();
      //   return res.json({ data: followings });
      res.json({ data: [] });
    })
  )
  .post(
    verifyUserAuthenticationToken,
    schemaValidation(CreateFollowingSchema),
    requestValidation(async (req, res) => {
      const { followerUser, followedUser } = req.body;
      //falta validar que ambos usuarios existan...
      await FollowingController.setFollow(followerUser, followedUser);
      return res.status(201).send();
    })
  );

module.exports = Router;

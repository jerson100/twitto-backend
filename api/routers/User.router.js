const { Router: RouterExpress } = require("express");
const requestValidation = require("../middlewares/requestValidation");
const { validationSchema } = require("../middlewares/ValidationSchema");
const {
  UserCreateSchemaValidation,
} = require("../models/User/User.validation");
const UserController = require("../controllers/User.controller");
const { NotFoundUserException } = require("../models/User/User.exception");
const { generatePassword } = require("../utils/validation/password");
const { isRegisteredUser } = require("../middlewares/user");

const FollowingController = require("../controllers/Following.controller");

//sistema de middleware y direccionamiento completo
const Router = RouterExpress();

Router.route("/")
  .get(async (req, res) => {
    const users = await UserController.all();
    return res.status(200).json({ data: users });
  })
  .post(
    isRegisteredUser(),
    validationSchema(UserCreateSchemaValidation),
    requestValidation(async (req, res) => {
      req.body.password = await generatePassword(req.body.username);
      const newUser = await UserController.create(req.body);
      return res.status(201).json({ data: newUser });
    })
  );

Router.route("/:id").get(
  requestValidation(async (req, res) => {
    const user = await UserController.getById(req.params.id);
    if (!user) throw new NotFoundUserException();
    return res.json({ data: user });
  })
);

Router.route("/:id/followers").get(
  requestValidation(async (req, res) => {
    const followers = await FollowingController.getFollowersById(req.params.id);
    return res.json({ data: followers });
  })
);

Router.route("/:id/following").get(
  requestValidation(async (req, res) => {
    const followeds = await FollowingController.getFollowedsById(req.params.id);
    return res.json({ data: followeds });
  })
);

Router.route("/:idUser/following/:idFollowedUser").delete(
  requestValidation(async (req, res) => {
    const { idUser: followerUser, idFollowedUser: followedUser } = req.params;
    await FollowingController.setUnFollow(followerUser, followedUser);
    return res.send();
  })
);

module.exports = Router;

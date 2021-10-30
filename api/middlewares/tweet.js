const TweetController = require("../controllers/Tweet.controller");
const { ForbiddenUserException } = require("../models/User/User.exception");

//antes de usar este middleware es necesario usar el middleware verifyUserAuthenticationToken
const isItMyTweet = async (req, res, next) => {
  const {
    us: { _id: idUser },
  } = req;
  const { idTweet } = req.params;
  const isMyTweet = await TweetController.getByIdUserAndIdTweet(
    idUser,
    idTweet
  );
  if (!isMyTweet) {
    next(new ForbiddenUserException());
  } else {
    next();
  }
};

module.exports = {
  isItMyTweet,
};

const Joi = require("joi");
const { REGEX } = require("../../configs/constant");

const CreateFollowingSchema = Joi.object({
  followerUser: Joi.string().regex(REGEX.OBJECT_ID).required(),
  followedUser: Joi.string().regex(REGEX.OBJECT_ID).required(),
  state: Joi.number().default(1),
});

module.exports = {
  CreateFollowingSchema,
};

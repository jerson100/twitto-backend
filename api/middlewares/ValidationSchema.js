const {
  SchemaValidationError,
} = require("../utils/validation/validationSchema");

const validationSchema = (schema, property = "body") => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      convert: false,
    });
    if (!error) {
      req[property] = { ...req[property], ...value };
      next();
    } else {
      const { details } = error;
      const message = details
        .map((i) => i.message)
        .join(", ")
        .trim();
      next(new SchemaValidationError(message));
    }
  };
};

module.exports = {
  validationSchema,
};

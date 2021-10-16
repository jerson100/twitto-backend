const jwt = require("jsonwebtoken");

class JwtException extends Error {
  constructor(message = "Error al momento de generar el token", status = 400) {
    super(message);
    this.status = status;
    this.name = "JwtException";
  }
}

const encode = async (payload) => {
  try {
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3hrs",
    });
    return token;
  } catch (e) {
    throw new JwtException();
  }
};

module.exports = {
  encode,
};

const jwt = require("jsonwebtoken");

class EncodeJwtException extends Error {
  constructor(message = "Error al momento de generar el token", status = 500) {
    super(message);
    this.status = status;
    this.name = "EncodeJwtException";
  }
}

class DecodedJwtException extends Error {
  constructor(message = "Token no válido", status = 400) {
    super(message);
    this.status = status;
    this.name = "DecodedJwtException";
  }
}

class JwtException extends Error {
  constructor(
    message = "Necesita del token para poder acceder al recurso solicitado",
    status = 400
  ) {
    super(message);
    this.status = status;
    this.name = "JwtException";
  }
}

const encode = (payload) => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3hr",
    });
    return token;
  } catch (e) {
    return new EncodeJwtException();
  }
};

const decoded = (token) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  return payload;
};

module.exports = {
  encode,
  decoded,
  DecodedJwtException,
  EncodeJwtException,
  JwtException,
};

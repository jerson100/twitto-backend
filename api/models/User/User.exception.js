class NotFoundUserException extends Error {
  constructor(msg = "No se encontró el usuario", status = 404) {
    super(msg);
    this.status = status;
    this.name = "NotFoundUserException";
  }
}
class RegisteredUserException extends Error {
  constructor(
    msg = "El usuario con ese username ya se encuentra registrado en nuestro sistema",
    status = 400
  ) {
    super(msg);
    this.status = status;
    this.name = "RegisteredUserException";
  }
}

module.exports = { NotFoundUserException, RegisteredUserException };

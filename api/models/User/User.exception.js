class NotFoundUserException extends Error {
  constructor(msg = "No se encontró el usuario", status = 404) {
    super(msg);
    this.status = status;
    this.name = "NotFoundUserException";
  }
}
class UnauthorizedUserException extends Error {
  constructor(msg = "El usuario no está autenticado", status = 401) {
    super(msg);
    this.status = status;
    this.name = "UnauthorizedUserException";
  }
}

class ForbiddenUserException extends Error {
  constructor(
    msg = "El usuario no puede ver, ni realizar nada con el recurso solicitado porque puede que no exista o simplemente no tenga acceso a dicho recurso",
    status = 403
  ) {
    super(msg);
    this.status = status;
    this.name = "ForbiddenUserException";
  }
}

class RegisteredUserException extends Error {
  constructor(msg = "No se pudo registrar el usuario", status = 400) {
    super(msg);
    this.status = status;
    this.name = "RegisteredUserException";
  }
}

class UpdateUserException extends Error {
  constructor(msg = "No se pudo actualizar el usuario", status = 400) {
    super(msg);
    this.status = status;
    this.name = "UpdateUserException";
  }
}

module.exports = {
  NotFoundUserException,
  ForbiddenUserException,
  UnauthorizedUserException,
  RegisteredUserException,
  UpdateUserException
};

class SchemaValidationError extends Error {
  constructor(
    message = "Error al validar la petición del cliente",
    status = 400
  ) {
    super(message);
    this.status = status;
    this.name = "SchemaValidationError";
  }
}

module.exports = { SchemaValidationError };

/**
 * Error that carries the HTTP status our API should answer with.
 * Route handlers translate it into `{ error: message }`.
 */
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

module.exports = { HttpError };
